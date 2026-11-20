# تطبيق أندرويد (APK) لموقع Hook

الملفات دي بتبني من الموقع تطبيق أندرويد بنفس الموقع جوّاه، من غير ما تحتاج Android Studio ولا تثبّت حاجة على جهازك. البناء بيتم على GitHub.

## تعمل الـ APK إزاي
1. تأكد إن الفولدرين `apk` و`.github` موجودين في الـ repository (بجانب ملفات الموقع).
   - `.github` فولدر مخفي. لو مش قادر ترفعه بالسحب: من GitHub اختار **Add file > Create new file**، واكتب في الاسم `.github/workflows/android-apk.yml` والصق محتوى الملف.
2. افتح الـ repository على GitHub > تبويب **Actions** > **Build Android APK** > **Run workflow**.
   - **mode = live** (الافتراضي): التطبيق بيفتح الموقع المنشور، فأي تعديل ترفعه على الموقع بيظهر في التطبيق لوحده من غير APK جديد.
   - **mode = bundled**: ملفات الموقع بتتحط جوه الـ APK نفسه. لازم تبني APK جديد مع كل تعديل.
3. استنى حوالي 6 إلى 10 دقايق. في آخر الصفحة تحت **Artifacts** هتلاقي ملفات الـ APK. نزّل واحد واستخرجه (zip) وانقل ملف `.apk` على الموبايل وافتحه (لازم تسمح بالتثبيت من مصدر غير معروف).
4. عايز APK ينزل في **Releases** بالرقم؟ اعمل tag زي `v1.0.0` وهيتنشر لوحده.

## نسخ الجافا (Java)
الـ workflow بيبني التطبيق 3 مرات بالتوازي، وكل واحدة بجافا مختلفة:

| Java | ملاحظة |
|---|---|
| **27** | أحدث إصدار من Java (Temurin 27) |
| **25** | أحدث إصدار LTS |
| **21** | اللي Capacitor 8 بيدعمه رسمياً، شبكة أمان |

لو اتبنوا كلهم، حمّل **Java 27** (أحدث واحدة). لو واحدة فشلت ما بتوقفش التانيين. عشان تغيّر النسخ عدّل قايمة `matrix` في ملف `.github/workflows/android-apk.yml`. Java 25 و27 محتاجين Gradle 9، وبيتظبط لوحده في الـ workflow.

## توقيع التطبيق (اختياري، للنسخة النهائية أو Google Play)
الـ APK العادي (debug) بيتثبّت على أي موبايل. لو عايز نسخة موقّعة:
1. اعمل keystore مرة واحدة على جهازك: `keytool -genkeypair -v -keystore hook.jks -alias hook -keyalg RSA -keysize 2048 -validity 10000`
2. حوّله لنص: `base64 -w0 hook.jks` (على ويندوز: `certutil -encode hook.jks hook.b64`).
3. في GitHub: **Settings > Secrets and variables > Actions > New repository secret** وضيف: `ANDROID_KEYSTORE_BASE64` و`ANDROID_KEYSTORE_PASSWORD` و`ANDROID_KEY_ALIAS` و`ANDROID_KEY_PASSWORD`.
4. شغّل الـ workflow، وهيطلع ملف `...-release-...apk` موقّع. **احتفظ بملف الـ keystore وكلمة سره في مكان آمن**، لأن من غيره مش هتقدر تحدّث نفس التطبيق.

## اللي بيشتغل مختلف جوه التطبيق
- زرار **الدخول بجوجل** بيتشال جوه التطبيق (جوجل مابتسمحش بيه داخل WebView). الدخول بالإيميل والباسورد شغّال عادي.
- **واتساب** بيتفتح في تطبيق واتساب نفسه.
- **تحميل PDF و Excel** (للأدمن في صفحات الإدارة) مش بيشتغل جوه التطبيق، استخدمه من متصفح الموبايل أو الكمبيوتر.
- التطبيق محتاج إنترنت لأن الطلبات والحسابات على الخادم.

## تغيير الاسم أو الأيقونة أو العنوان
- الاسم ومعرّف التطبيق: `apk/prepare.mjs` (`appName` و`appId`). معرّف التطبيق (`appId`) متغيّرهوش بعد النشر على Google Play.
- الأيقونة وشاشة البداية: استبدل الصور في `apk/assets` (اللي فيها `icon-only.png` و`icon-foreground.png` و`icon-background.png` و`splash.png` و`splash-dark.png`).
- عنوان الموقع: في الـ workflow اكتبه في `site_url` أو غيّر القيمة الافتراضية في `prepare.mjs`.
