(function(){
const ACTIONS={'index.html':[['+ Project','+ مشروع','work'],['+ Client','+ عميل','clients']],'portfolio.html':[['+ Project','+ مشروع','work'],['Sections','الأقسام','cats:work']],'shop.html':[['+ Product / course','+ منتج / كورس','products'],['Sections','الأقسام','cats:shop'],['Shipping','الشحن','ship']]};
/* field: [path, 'EN|AR label', type, options] */
const STLAB={package:['Package','باقة'],product:['Product','منتج'],sticker:['Sticker','ستيكر'],software:['Software system','نظام برمجي'],course:['Course','كورس']};
function stLabel(ty){const x=STLAB[ty]||STLAB.product;return t(x[0],x[1])}
const FIELDS={
 work:[['cat','Section|القسم','select',()=>[['','—']].concat(cats('work').map(c=>[c.id,L(c.name)]))],['name.en','Name (EN)|الاسم (EN)'],['name.ar','Name (AR)|الاسم (AR)'],['desc.en','Description (EN)|الوصف (EN)','area'],['desc.ar','Description (AR)|الوصف (AR)','area'],['img','Cover image|صورة الغلاف','image'],['video','Video: YouTube or Drive link, or upload an MP4 (max 10 MB)|فيديو: لينك يوتيوب أو درايف، أو ارفع MP4 (لحد 10 ميجا)','video']],
 clients:[['name','Client name|اسم العميل'],['logo','Logo|اللوجو','image']],
 products:[
  ['cat','Section|القسم','select',()=>cats('shop').map(c=>[c.id,L(c.name)+' · '+stLabel(c.type)])],
  ['name.en','Name (EN)|الاسم (EN)'],['name.ar','Name (AR)|الاسم (AR)'],
  ['desc.en','Description (EN)|الوصف (EN)','area'],['desc.ar','Description (AR)|الوصف (AR)','area'],
  ['img','Image (optional)|صورة (اختياري)','image'],
  ['spec.en','Size / material (EN), e.g. 15.6 inch, matte|المقاس / الخامة (EN)'],['spec.ar','Size / material (AR)|المقاس / الخامة (AR)'],
  ['license','How is it sold?|بيتباع إزاي؟','select',()=>[['buy',t('Buy (one-time payment)','شراء (دفعة واحدة)')],['rent',t('Rent (subscription)','إيجار (اشتراك)')]]],
  ['period','Rent is paid|الإيجار بيتدفع','select',()=>[['month',t('Every month','كل شهر')],['year',t('Every year','كل سنة')]]],
  ['unit','Sold by|بيتباع بـ','select',()=>[['item',t('One item / package','حاجة واحدة / باقة')],['piece',t('Piece','القطعة')],['meter',t('Meter','المتر')],['sheet',t('Sheet','الورقة')]]],
  ['pricing','Price type|نوع السعر','select',()=>[['total',t('Fixed total price (a pack)','سعر إجمالي ثابت (عبوة)')],['per',t('Price per piece / meter / sheet','سعر للقطعة / المتر / الورقة')]]],
  ['price','Price EGP|السعر بالجنيه','number'],
  ['amount','Units in one pack, e.g. 100 sheets|عدد الوحدات في العبوة، مثلاً 100 ورقة','number'],
  ['min','Minimum quantity|أقل كمية','number'],['step','Quantity step, e.g. 0.5 for half a meter|مقدار الزيادة، مثلاً 0.5 لنص متر','number'],
  ['demoUrl','Demo link, so the customer can try it|رابط التجربة عشان العميل يجرّب'],['demoUser','Demo username|اليوزر التجريبي'],['demoPass','Demo password|الباسورد التجريبي'],
  ['sku','Product code (SKU), you choose it|كود المنتج (SKU) إنت اللي بتحدده'],['stock','Stock quantity (empty = not tracked)|الكمية في المخزن (فاضي = من غير تتبع)','number'],
  ['per.en','Billing text (EN), e.g. per month|نص الدفع (EN)، مثلاً شهرياً'],['per.ar','Billing text (AR)|نص الدفع (AR)'],
  ['tag.en','Small label (EN)|ليبل صغير (EN)'],['tag.ar','Small label (AR)|ليبل صغير (AR)'],
  ['items.en','Features EN, one per line|المميزات EN، كل سطر ميزة','area'],['items.ar','Features AR, one per line|المميزات AR، كل سطر ميزة','area'],
  ['episodes','Course: number of episodes|الكورس: عدد الحلقات','number'],['hours','Course: total hours|الكورس: عدد الساعات','number'],
  ['discType','Discount type|نوع الخصم','select',()=>[['percent',t('Percent %','نسبة مئوية %')],['price',t('Fixed sale price','سعر محدد')]]],['disc','Discount % (0 = no discount)|الخصم % (0 = من غير خصم)','number'],['discPrice','Sale price EGP (must be lower than the price)|سعر العرض بالجنيه (لازم يكون أقل من السعر)','number'],
  ['discEnds','Discount ends at (empty = no countdown)|الخصم بينتهي في (فاضي = من غير عد تنازلي)','datetime']],
 buttons:[['label.en','Label (EN)|النص (EN)'],['label.ar','Label (AR)|النص (AR)'],['href','Link|الرابط']],
 contact:[['email','Email|الإيميل'],['whatsapp','WhatsApp number with country code|رقم الواتساب بكود الدولة']],
 social:[['facebook','Facebook link|لينك فيسبوك'],['instagram','Instagram link|لينك إنستجرام'],['tiktok','TikTok link|لينك تيك توك']]};
const TITLE={work:['project','المشروع'],clients:['client','العميل'],products:['product or course','المنتج أو الكورس'],coupons:['coupon','الكوبون'],buttons:['button','الزر'],contact:['contact details','بيانات التواصل'],social:['social links','لينكات السوشيال']};
const SINGLE=['contact','social'];
const lab=s=>t(...s.split('|'));
const get=(o,p)=>p.split('.').reduce((a,k)=>a==null?a:a[k],o);
const setp=(o,p,v)=>{const k=p.split('.');k.slice(0,-1).forEach(x=>o=o[x]=o[x]||{});o[k[k.length-1]]=v};
const find=(kind,id)=>kind==='buttons'?DB.buttons[id]:SINGLE.includes(kind)?DB[kind]:DB[kind].find(x=>x.id===id);
const jj=r=>r.json().catch(()=>({}));
async function req(url,method,body){try{const r=await fetch(url,{method:method,headers:{'content-type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});return{ok:r.ok,j:await jj(r)}}catch(e){return{ok:false,j:{error:'Network error: '+e.message}}}}
const apply=async j=>{if(j&&j.content){DB=j.content;cacheDB(DB);runHooks()}else await reloadContent();if(window.afterSave)window.afterSave()};

/* images are shrunk before upload so saving is fast */
function shrink(file){
  if(!/^image\/(png|jpeg)$/.test(file.type)||file.size<500000)return Promise.resolve(file);
  return new Promise(res=>{const i=new Image(),u=URL.createObjectURL(file);
    i.onload=()=>{const k=Math.min(1,1600/Math.max(i.width,i.height));URL.revokeObjectURL(u);if(k===1&&file.size<1.5e6)return res(file);
      const c=document.createElement('canvas');c.width=Math.round(i.width*k);c.height=Math.round(i.height*k);c.getContext('2d').drawImage(i,0,0,c.width,c.height);c.toBlob(b=>res(b||file),file.type,.85)};
    i.onerror=()=>res(file);i.src=u});
}
function drawMark(x,W,H,w,done){
  x.save();x.globalAlpha=Math.max(.05,w.opacity/100);const fs=Math.max(14,Math.round(Math.min(W,H)*w.size/100));
  const put=(draw,tile)=>{
    if(w.position==='tile'){const sx=tile.w*1.8,sy=tile.h*3.2;x.translate(W/2,H/2);x.rotate(-Math.PI/7);for(let yy=-H;yy<H;yy+=sy)for(let xx=-W,r=0;xx<W;xx+=sx,r++){draw(xx+(Math.round(yy/sy)%2?sx/2:0),yy)}}
    else if(w.position==='corner')draw(W-tile.w/2-fs*.6,H-tile.h/2-fs*.6);else{x.translate(W/2,H/2);x.rotate(-Math.PI/12);draw(0,0)}
    x.restore();done()};
  if(w.type==='logo'){const lg=new Image();lg.onload=()=>{const lw=Math.max(60,W*w.size/100*3.2),lh=lw*lg.height/lg.width;x.shadowColor='rgba(0,0,0,.5)';x.shadowBlur=lw/18;put((px,py)=>x.drawImage(lg,px-lw/2,py-lh/2,lw,lh),{w:lw,h:lh})};lg.onerror=()=>{x.restore();done()};lg.src='logo-cream.png';return}
  x.font='800 '+fs+'px Rubik,Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillStyle='#fff';x.strokeStyle='rgba(0,0,0,.45)';x.lineWidth=Math.max(1.5,fs/12);
  const tw=x.measureText(w.text).width;put((px,py)=>{x.strokeText(w.text,px,py);x.fillText(w.text,px,py)},{w:tw,h:fs});
}
function burn(file){
  const w=DB.watermark;if(!w||!w.enabled||w.mode!=='burn'||!/^image\/(png|jpeg|webp)$/.test(file.type))return shrink(file);
  return new Promise(res=>{const i=new Image(),u=URL.createObjectURL(file);
    i.onload=()=>{URL.revokeObjectURL(u);const k=Math.min(1,1600/Math.max(i.width,i.height)),c=document.createElement('canvas');c.width=Math.round(i.width*k);c.height=Math.round(i.height*k);const x=c.getContext('2d');x.drawImage(i,0,0,c.width,c.height);
      drawMark(x,c.width,c.height,w,()=>c.toBlob(b=>res(b||file),file.type==='image/png'?'image/png':'image/jpeg',.9))};
    i.onerror=()=>res(file);i.src=u});
}
async function upImage(file,mark){const r=await fetch('/api/admin/upload',{method:'POST',body:await(mark?burn(file):shrink(file))}),j=await jj(r);if(!r.ok)throw new Error(errT(j.error||'Bad response'));return j.path}
function poster(file){
  return new Promise(res=>{const v=document.createElement('video'),u=URL.createObjectURL(file);v.muted=true;v.playsInline=true;v.preload='metadata';
    v.onloadeddata=()=>{v.currentTime=Math.min(1,(v.duration||1)/2)};
    v.onseeked=()=>{try{const k=Math.min(1,1280/Math.max(v.videoWidth,v.videoHeight)),c=document.createElement('canvas');c.width=Math.round(v.videoWidth*k);c.height=Math.round(v.videoHeight*k);c.getContext('2d').drawImage(v,0,0,c.width,c.height);URL.revokeObjectURL(u);c.toBlob(b=>res(b),'image/jpeg',.85)}catch(e){res(null)}};
    v.onerror=()=>res(null);v.src=u;setTimeout(()=>res(null),8000)});
}

const dlocal=iso=>{const d=new Date(iso),p=n=>String(n).padStart(2,'0');return d.getFullYear()+'-'+p(d.getMonth()+1)+'-'+p(d.getDate())+'T'+p(d.getHours())+':'+p(d.getMinutes())};
const dlg=document.createElement('dialog');document.body.appendChild(dlg);
function btn(cls,txt,type){const b=document.createElement('button');b.className=cls;b.type=type||'button';b.textContent=txt;return b}
/* automatic translation Arabic <-> English (Google Translate, through the Apps Script) */
let AUTOTR=true;try{AUTOTR=localStorage.getItem('hookautotr')!=='0'}catch(e){}
async function trCall(texts,from){const r=await req('/api/admin/translate','POST',{texts:texts,from:from});return r.ok&&Array.isArray(r.j.texts)?r.j.texts:null}
function trToggle(){
  const w=document.createElement('label'),c=document.createElement('input'),s=document.createElement('span');w.className='chk trtog';c.type='checkbox';c.checked=AUTOTR;s.textContent=t('Translate automatically (Arabic ⇄ English)','ترجمة تلقائية (عربي ⇄ إنجليزي)');
  c.onchange=()=>{AUTOTR=c.checked;try{localStorage.setItem('hookautotr',AUTOTR?'1':'0')}catch(e){}};w.append(c,s);return w;
}
function autoPair(en,ar,multi,enBtnHost,arBtnHost){
  const auto=new WeakSet(),orig=new Map([[en,en.value],[ar,ar.value]]),timers=new Map(),ph=new Map([[en,en.placeholder],[ar,ar.placeholder]]);
  const run=async(src,dst,from,force)=>{
    const v=src.value.trim();if(!v)return;
    if(!force&&dst.value.trim()&&!auto.has(dst)&&dst.value!==orig.get(dst))return;
    dst.classList.add('trbusy');const parts=multi?v.split('\n'):[v],out=await trCall(parts,from);dst.classList.remove('trbusy');
    if(!out){dst.placeholder='⚠ '+t('Could not translate, write it yourself','معرفناش نترجم، اكتبه بنفسك');return}
    dst.placeholder=ph.get(dst)||'';dst.value=out.join(multi?'\n':' ');auto.add(dst);dst._tr=true;dst.dispatchEvent(new Event('input'));
  };
  [[en,ar,'en'],[ar,en,'ar']].forEach(([src,dst,from])=>{
    src.addEventListener('input',()=>{if(src._tr){src._tr=false;return}auto.delete(src);clearTimeout(timers.get(src));if(!AUTOTR)return;timers.set(src,setTimeout(()=>run(src,dst,from,false),900))});
  });
  const mkb=(host,src,dst,from)=>{if(!host)return;const b=document.createElement('button');b.type='button';b.className='trb';b.textContent='🌐';b.title=t('Translate this from the other language','ترجم ده من اللغة التانية');b.onclick=()=>run(src,dst,from,true);host.appendChild(b)};
  mkb(enBtnHost,ar,en,'ar');mkb(arBtnHost,en,ar,'en');
}
function editor(kind,id){
  const it=id||SINGLE.includes(kind)?find(kind,id):null,isNew=!it;
  const form=document.createElement('form'),h=document.createElement('h3');
  h.textContent=(isNew?t('Add ','إضافة '):t('Edit ','تعديل '))+t(...TITLE[kind]);form.appendChild(h);
  form.appendChild(trToggle());
  const inputs={};
  FIELDS[kind].forEach(([p,l,type,opts])=>{
    const w=document.createElement('label'),s=document.createElement('span');s.textContent=lab(l);w.appendChild(s);
    let el;
    if(type==='select'){el=document.createElement('select');(typeof opts==='function'?opts():opts).forEach(o=>{const [v,l]=Array.isArray(o)?o:[o,o];const op=document.createElement('option');op.value=v;op.textContent=l;el.appendChild(op)})}
    else if(type==='area'){el=document.createElement('textarea');el.rows=3}
    else{el=document.createElement('input');if(type==='number'){el.type='number';el.min=0;el.step='any'}if(type==='datetime')el.type='datetime-local'}
    const src=it&&kind==='products'?pdef(it):it;let v=src?get(src,p):'';
    if(type==='datetime')v=v?dlocal(v):'';
    if(kind==='products'&&p.startsWith('items.'))v=it?it.items.map(x=>x[p.slice(6)]).join('\n'):'';
    el.value=v==null?'':v;if(type==='select'&&el.selectedIndex<0&&el.options.length)el.selectedIndex=0;inputs[p]=el;w.appendChild(el);
    if(type==='image'){
      const f=document.createElement('input');f.type='file';f.accept='image/png,image/jpeg,image/webp';
      const pv=document.createElement('img');pv.style.cssText='max-height:110px;max-width:100%;object-fit:contain;border-radius:12px;display:none';
      const show=()=>{pv.src=el.value;pv.style.display=el.value?'block':'none'};show();el.addEventListener('input',show);
      f.onchange=async()=>{const file=f.files[0];if(!file)return;ok.disabled=true;msg.className='msg';msg.textContent=t('Uploading the image, please wait...','بيرفع الصورة، استنى شوية...');
        try{el.value=await upImage(file,kind==='products');show();msg.textContent=''}catch(e){msg.className='msg err';msg.textContent=e.message||t('Upload failed, try again.','الرفع فشل، جرّب تاني.')}
        ok.disabled=false};
      w.append(f,pv);
    }
    if(type==='video'){
      const f=document.createElement('input');f.type='file';f.accept='video/mp4,video/webm';
      f.onchange=async()=>{const file=f.files[0];if(!file)return;
        if(file.size>10*1024*1024){msg.className='msg err';msg.textContent=t('This video is bigger than 10 MB. Upload it to YouTube or Google Drive and paste the link instead.','الفيديو أكبر من 10 ميجا. ارفعه على يوتيوب أو جوجل درايف وحط اللينك هنا.');f.value='';return}
        ok.disabled=true;msg.className='msg';msg.textContent=t('Uploading the video, this can take a minute...','بيرفع الفيديو، ممكن ياخد دقيقة...');
        try{const r=await fetch('/api/admin/upload-video',{method:'POST',body:file}),j=await jj(r);if(!r.ok)throw new Error(errT(j.error||'Bad response'));el.value=j.video;msg.textContent='';
          if(!inputs.img.value){const pb=await poster(file);if(pb){msg.textContent=t('Making a cover image...','بيعمل صورة غلاف...');inputs.img.value=await upImage(pb);inputs.img.dispatchEvent(new Event('input'));msg.textContent=''}}}
        catch(e){msg.className='msg err';msg.textContent=e.message||t('Upload failed, try again.','الرفع فشل، جرّب تاني.')}
        ok.disabled=false};
      w.append(f);
    }
    form.appendChild(w);
  });
  Object.keys(inputs).filter(k=>k.endsWith('.en')&&inputs[k.slice(0,-3)+'.ar']).forEach(k=>{const base=k.slice(0,-3),a=inputs[k],b=inputs[base+'.ar'];autoPair(a,b,base==='items',a.closest('label').querySelector('span'),b.closest('label').querySelector('span'))});
  if(kind==='products'){
    /* the form only shows what the chosen section needs: package, product, sticker, software system or course */
    const TF={
      package:['name.en','name.ar','desc.en','desc.ar','img','price','per.en','per.ar','items.en','items.ar','tag.en','tag.ar','discType','disc','discPrice','discEnds'],
      product:['name.en','name.ar','desc.en','desc.ar','img','unit','pricing','price','amount','min','step','tag.en','tag.ar','sku','stock','discType','disc','discPrice','discEnds'],
      sticker:['name.en','name.ar','desc.en','desc.ar','img','spec.en','spec.ar','price','min','step','tag.en','tag.ar','sku','stock','discType','disc','discPrice','discEnds'],
      software:['name.en','name.ar','desc.en','desc.ar','img','items.en','items.ar','license','period','price','demoUrl','demoUser','demoPass','tag.en','tag.ar','discType','disc','discPrice','discEnds'],
      course:['name.en','name.ar','desc.en','desc.ar','img','price','episodes','hours','tag.en','tag.ar','discType','disc','discPrice','discEnds']};
    const HINT={package:['A package: one fixed price, with its features list.','باقة: سعر ثابت وتحتها قايمة المميزات.'],product:['A product: sold by item, piece, meter or sheet, with stock.','منتج: بيتباع بالقطعة أو المتر أو الورقة، وفيه مخزون.'],sticker:['A sticker: priced per piece, with its size or material and stock.','ستيكر: السعر للقطعة، مع المقاس أو الخامة والمخزون.'],software:['A software system: buy or rent, with a demo link and a demo account so the customer can try it.','نظام برمجي: شراء أو إيجار، ومعاه رابط وحساب تجريبي عشان العميل يجرّب.'],course:['A course: episodes and hours.','كورس: عدد الحلقات والساعات.']};
    const show=(p,on)=>{const w=inputs[p]&&inputs[p].closest('label');if(w)w.style.display=on?'':'none'};
    const lab=(p,txt)=>{const sp=inputs[p]&&inputs[p].closest('label')&&inputs[p].closest('label').querySelector('span');if(sp)sp.textContent=txt};
    const hint=document.createElement('p');hint.className='hint';inputs.cat.closest('label').after(hint);
    const refresh=()=>{
      const ty=catType(inputs.cat.value),on=new Set(TF[ty]||TF.product);
      Object.keys(inputs).forEach(k=>{if(k!=='cat')show(k,on.has(k))});
      hint.textContent=t(...(HINT[ty]||HINT.product));
      const dt=inputs.discType.value;if(on.has('discType')){show('disc',dt==='percent');show('discPrice',dt==='price')}
      if(ty==='product'){const unit=inputs.unit.value,per=inputs.pricing.value==='per',multi=unit!=='item';show('pricing',multi);show('amount',multi&&!per);show('min',multi&&per);show('step',multi&&per);show('per.en',!multi);show('per.ar',!multi);lab('price',multi&&per?t('Price per unit (EGP)','السعر للوحدة (جنيه)'):t('Total price (EGP)','السعر الإجمالي (جنيه)'))}
      else if(ty==='sticker')lab('price',t('Price per sticker (EGP)','سعر الاستيكر الواحد (جنيه)'));
      else if(ty==='software'){const rent=inputs.license.value==='rent';show('period',rent);lab('price',rent?(inputs.period.value==='year'?t('Rent price per year (EGP)','سعر الإيجار في السنة (جنيه)'):t('Rent price per month (EGP)','سعر الإيجار في الشهر (جنيه)')):t('Price (EGP, one-time)','السعر (جنيه، مرة واحدة)'))}
      else if(ty==='course')lab('price',t('Course price (EGP)','سعر الكورس (جنيه)'));
      else lab('price',t('Price (EGP)','السعر (جنيه)'));
    };
    ['cat','unit','pricing','discType','license','period'].forEach(k=>inputs[k].addEventListener('change',refresh));refresh();
  }
  const msg=document.createElement('p');msg.className='msg err';form.appendChild(msg);
  const row=document.createElement('div');row.className='row';
  const ok=btn('btn',t('Save','حفظ'),'submit'),no=btn('btn ghost',t('Cancel','إلغاء'));no.onclick=()=>dlg.close();
  row.append(ok,no);
  if(it&&['work','clients','products'].includes(kind)){
    const del=btn('btn del',t('Delete','حذف'));
    del.onclick=async()=>{if(!confirm(t('Delete this item?','تحذف العنصر ده؟')))return;del.disabled=true;
      const r=await req(`/api/admin/${kind}/${id}`,'DELETE'),j=r.j;if(r.ok){await apply(j);dlg.close()}else{del.disabled=false;msg.textContent=errT(j.error||'Bad response')}};
    row.appendChild(del);
  }
  form.appendChild(row);
  form.onsubmit=async e=>{
    e.preventDefault();const data={};
    Object.entries(inputs).forEach(([p,el])=>{if(!(kind==='products'&&p.startsWith('items.')))setp(data,p,el.type==='datetime-local'?(el.value?new Date(el.value).toISOString():''):el.value)});
    if(kind==='products'){const en=inputs['items.en'].value.split('\n').map(s=>s.trim()).filter(Boolean),a=inputs['items.ar'].value.split('\n').map(s=>s.trim()).filter(Boolean);
      data.items=Array.from({length:Math.max(en.length,a.length)},(_,i)=>({en:en[i]||a[i]||'',ar:a[i]||en[i]||''}))}
    const url=kind==='contact'?'/api/admin/contact':kind==='social'?'/api/admin/social':kind==='buttons'?`/api/admin/buttons/${id}`:`/api/admin/${kind}${id?'/'+id:''}`;
    ok.disabled=true;msg.className='msg';msg.textContent=t('Saving...','بيحفظ...');
    const r=await req(url,id||SINGLE.includes(kind)?'PUT':'POST',data),j=r.j;
    if(r.ok){await apply(j);dlg.close()}else{ok.disabled=false;msg.className='msg err';msg.textContent=errT(j.error||'Error')}
  };
  dlg.replaceChildren(form);dlg.showModal();
}

/* sections (categories) for the portfolio and the shop */
function catEditor(kind){
  const list=JSON.parse(JSON.stringify(cats(kind))),form=document.createElement('form'),h=document.createElement('h3'),box=document.createElement('div');
  h.textContent=kind==='shop'?t('Shop sections','أقسام المتجر'):t('Portfolio sections','أقسام الشغل');form.appendChild(h);box.className='catlist';form.appendChild(box);
  const note=document.createElement('p');note.style.cssText='opacity:.75;font-size:.9rem';note.textContent=kind==='shop'?t('Choose the type of each section (package, product, sticker, software system, course): the product form then shows only what that type needs. Deleting a section moves its products to the first section.','اختار نوع كل قسم (باقة، منتج، ستيكر، نظام برمجي، كورس): نموذج إضافة المنتج بيظهر بس اللي النوع ده محتاجه. ولو مسحت قسم، منتجاته بتروح لأول قسم.'):t('Deleting a section keeps its projects, they just show under All.','لو مسحت قسم، مشاريعه بتفضل موجودة وبتظهر في "الكل".');form.appendChild(note);
  const draw=()=>{box.replaceChildren();list.forEach((c,i)=>{
    const r=document.createElement('div');r.className='catrow';
    const en=document.createElement('input'),arb=document.createElement('input'),x=btn('catx','×');en.placeholder='English';arb.placeholder='العربي';arb.dir='rtl';en.value=c.name.en||'';arb.value=c.name.ar||'';
    en.oninput=()=>c.name.en=en.value;arb.oninput=()=>c.name.ar=arb.value;x.setAttribute('aria-label','Delete');x.onclick=()=>{list.splice(i,1);draw()};
    if(kind==='shop'){const ty=document.createElement('select');ty.setAttribute('aria-label','Type');Object.keys(STLAB).forEach(k=>{const o=document.createElement('option');o.value=k;o.textContent=stLabel(k);ty.appendChild(o)});ty.value=c.type||'product';c.type=ty.value;ty.onchange=()=>{c.type=ty.value};r.classList.add('typed');r.append(en,arb,ty,x)}else r.append(en,arb,x);box.appendChild(r);autoPair(en,arb,false)})};
  form.insertBefore(trToggle(),box);draw();
  const add=btn('btn ghost',t('+ Add section','+ ضيف قسم'));add.onclick=()=>{list.push({id:'',name:{en:'',ar:''},type:'product'});draw()};form.appendChild(add);
  const msg=document.createElement('p');msg.className='msg err';form.appendChild(msg);
  const row=document.createElement('div');row.className='row';const ok=btn('btn',t('Save','حفظ'),'submit'),no=btn('btn ghost',t('Cancel','إلغاء'));no.onclick=()=>dlg.close();row.append(ok,no);form.appendChild(row);
  form.onsubmit=async e=>{e.preventDefault();ok.disabled=true;msg.className='msg';msg.textContent=t('Saving...','بيحفظ...');
    const r=await req('/api/admin/categories','PUT',{kind:kind,list:list}),j=r.j;
    if(r.ok){await apply(j);dlg.close()}else{ok.disabled=false;msg.className='msg err';msg.textContent=errT(j.error||'Error')}};
  dlg.replaceChildren(form);dlg.showModal();
}

/* shipping: governorates and what each one costs */
function shipEditor(){
  const sh=DB.shipping||{enabled:true,regions:[]},list=JSON.parse(JSON.stringify(sh.regions||[])),form=document.createElement('form'),h=document.createElement('h3'),box=document.createElement('div');
  h.textContent=t('Shipping: governorates and fees','الشحن: المحافظات والتكلفة');form.appendChild(h);
  const on=document.createElement('label');on.className='chk';const cb=document.createElement('input');cb.type='checkbox';cb.checked=sh.enabled!==false;const sp=document.createElement('span');sp.textContent=t('Offer shipping to customers','فعّل الشحن للعملاء');on.append(cb,sp);form.appendChild(on);
  box.className='catlist';form.appendChild(box);
  const draw=()=>{box.replaceChildren();list.forEach((c,i)=>{
    const r=document.createElement('div'),en=document.createElement('input'),arb=document.createElement('input'),fee=document.createElement('input'),x=btn('catx','×');r.className='catrow shiprow';
    en.placeholder='English';arb.placeholder='العربي';arb.dir='rtl';fee.type='number';fee.min=0;fee.step='any';fee.placeholder=t('Fee EGP','التكلفة');en.value=c.name.en||'';arb.value=c.name.ar||'';fee.value=c.fee==null?'':c.fee;
    en.oninput=()=>c.name.en=en.value;arb.oninput=()=>c.name.ar=arb.value;fee.oninput=()=>c.fee=fee.value;x.setAttribute('aria-label','Delete');x.onclick=()=>{list.splice(i,1);draw()};
    r.append(en,arb,fee,x);box.appendChild(r);autoPair(en,arb,false)})};
  form.insertBefore(trToggle(),box);draw();
  const add=btn('btn ghost',t('+ Add governorate','+ ضيف محافظة'));add.onclick=()=>{list.push({id:'',name:{en:'',ar:''},fee:''});draw();box.lastChild&&box.lastChild.querySelector('input').focus()};form.appendChild(add);
  const msg=document.createElement('p');msg.className='msg err';form.appendChild(msg);
  const row=document.createElement('div');row.className='row';const ok=btn('btn',t('Save','حفظ'),'submit'),no=btn('btn ghost',t('Cancel','إلغاء'));no.onclick=()=>dlg.close();row.append(ok,no);form.appendChild(row);
  form.onsubmit=async e=>{e.preventDefault();ok.disabled=true;msg.className='msg';msg.textContent=t('Saving...','بيحفظ...');
    const r=await req('/api/admin/shipping','PUT',{enabled:cb.checked,regions:list}),j=r.j;
    if(r.ok){await apply(j);dlg.close()}else{ok.disabled=false;msg.className='msg err';msg.textContent=errT(j.error||'Error')}};
  dlg.replaceChildren(form);dlg.showModal();
}
/* discount coupons (c = an existing coupon from the dashboard, or nothing for a new one) */
function couponEditor(c){
  const form=document.createElement('form'),h=document.createElement('h3'),inputs={};
  h.textContent=c?t('Edit coupon','تعديل الكوبون'):t('New coupon','كوبون جديد');form.appendChild(h);
  const F=[['code','Coupon code (letters and numbers)|كود الكوبون (حروف وأرقام)','text'],['type','Discount type|نوع الخصم','select',[['percent',t('Percent %','نسبة مئوية %')],['amount',t('Fixed amount EGP','مبلغ ثابت بالجنيه')]]],['value','Value (percent, or EGP)|القيمة (نسبة أو جنيه)','number'],
    ['maxUses','Max number of uses (0 = unlimited)|أقصى عدد استخدامات (0 = من غير حد)','number'],['minOrder','Minimum order EGP (0 = none)|أقل قيمة للطلب بالجنيه (0 = من غير حد)','number'],['starts','Starts at (empty = now)|بيبدأ في (فاضي = دلوقتي)','datetime-local'],['ends','Ends at (empty = never)|بينتهي في (فاضي = مبينتهيش)','datetime-local'],['note','Note for you|ملاحظة ليك','text'],['partner','Partner name (optional)|اسم الشريك (اختياري)','text'],['commission','Partner commission, % of net sales (0 = none)|عمولة الشريك، % من صافي المبيعات (0 = من غير)','number']];
  F.forEach(([k,l,type,opts])=>{const w=document.createElement('label'),s=document.createElement('span');s.textContent=lab(l);w.appendChild(s);let el;
    if(type==='select'){el=document.createElement('select');opts.forEach(([v,lb])=>{const o=document.createElement('option');o.value=v;o.textContent=lb;el.appendChild(o)})}
    else{el=document.createElement('input');el.type=type;if(type==='number'){el.min=0;el.step='any'}if(k==='code')el.dir='ltr'}
    let v=c?c[k]:(k==='type'?'percent':(k==='maxUses'||k==='minOrder'||k==='commission')?0:'');if((k==='starts'||k==='ends')&&v)v=dlocal(v);el.value=v==null?'':v;inputs[k]=el;w.appendChild(el);form.appendChild(w)});
  const aw=document.createElement('label');aw.className='chk';const act=document.createElement('input');act.type='checkbox';act.checked=c?c.active!==false:true;const as=document.createElement('span');as.textContent=t('Active (customers can use it)','شغّال (العملاء يقدروا يستخدموه)');aw.append(act,as);form.appendChild(aw);
  const msg=document.createElement('p');msg.className='msg err';form.appendChild(msg);
  const row=document.createElement('div');row.className='row';const ok=btn('btn',t('Save','حفظ'),'submit'),no=btn('btn ghost',t('Cancel','إلغاء'));no.onclick=()=>dlg.close();row.append(ok,no);
  if(c){const del=btn('btn del',t('Delete','حذف'));del.onclick=async()=>{if(!confirm(t('Delete this coupon?','تحذف الكوبون ده؟')))return;const r=await req('/api/admin/coupons/'+c.id,'DELETE');if(r.ok){dlg.close();if(window.afterSave)afterSave()}else msg.textContent=errT(r.j.error||'Error')};row.appendChild(del)}
  form.appendChild(row);
  form.onsubmit=async e=>{e.preventDefault();const d={active:act.checked};Object.entries(inputs).forEach(([k,el])=>{d[k]=el.type==='datetime-local'?(el.value?new Date(el.value).toISOString():''):el.value});
    ok.disabled=true;msg.className='msg';msg.textContent=t('Saving...','بيحفظ...');const r=await req(c?'/api/admin/coupons/'+c.id:'/api/admin/coupons',c?'PUT':'POST',d);
    if(r.ok){dlg.close();if(window.afterSave)afterSave()}else{ok.disabled=false;msg.className='msg err';msg.textContent=errT(r.j.error||'Error')}};
  dlg.replaceChildren(form);dlg.showModal();
}
window.couponEditor=couponEditor;window.shipEditor=shipEditor;window.adminEdit=(k,id)=>editor(k,id);

/* edit any text or image of the page: switch on "Edit page", then click it */
function textEditor(el){
  const key=el.dataset.en,tx=(DB.texts||{})[key]||{},form=document.createElement('form'),h=document.createElement('h3');
  h.textContent=t('Edit text','تعديل النص');form.appendChild(h);
  const mk=(lb,val,rtl)=>{const w=document.createElement('label'),s=document.createElement('span'),a=document.createElement('textarea');s.textContent=lb;a.rows=3;a.value=val;if(rtl)a.dir='rtl';w.append(s,a);form.appendChild(w);return a};
  form.appendChild(trToggle());const en=mk('English',tx.en||key),arb=mk('العربي',tx.ar||el.dataset.ar||'',true);autoPair(en,arb,false,en.previousSibling,arb.previousSibling);
  const msg=document.createElement('p');msg.className='msg err';form.appendChild(msg);
  const row=document.createElement('div');row.className='row';const ok=btn('btn',t('Save','حفظ'),'submit'),no=btn('btn ghost',t('Cancel','إلغاء')),rs=btn('btn del',t('Back to default','رجّعه للأصلي'));no.onclick=()=>dlg.close();
  const send=async body=>{ok.disabled=true;msg.className='msg';msg.textContent=t('Saving...','بيحفظ...');
    const r=await req('/api/admin/texts','PUT',body),j=r.j;
    if(r.ok){await apply(j);dlg.close()}else{ok.disabled=false;msg.className='msg err';msg.textContent=errT(j.error||'Error')}};
  form.onsubmit=e=>{e.preventDefault();send({key:key,en:en.value,ar:arb.value})};rs.onclick=()=>send({key:key,reset:true});
  row.append(ok,no,rs);form.appendChild(row);dlg.replaceChildren(form);dlg.showModal();
}
function imageEditor(img){
  const key=img.dataset.o,form=document.createElement('form'),h=document.createElement('h3');h.textContent=t('Change this image','تغيير الصورة دي');form.appendChild(h);
  const pv=document.createElement('img');pv.src=img.src;pv.style.cssText='max-width:100%;max-height:150px;background:#1d1d1b;border-radius:12px;padding:8px;margin-bottom:10px';form.appendChild(pv);
  const f=document.createElement('input');f.type='file';f.accept='image/png,image/jpeg,image/webp';form.appendChild(f);
  const msg=document.createElement('p');msg.className='msg err';form.appendChild(msg);
  const row=document.createElement('div');row.className='row';const ok=btn('btn',t('Save','حفظ'),'submit'),no=btn('btn ghost',t('Cancel','إلغاء')),rs=btn('btn del',t('Back to default','رجّعها للأصلية'));no.onclick=()=>dlg.close();ok.disabled=true;let path='';
  f.onchange=async()=>{const file=f.files[0];if(!file)return;msg.className='msg';msg.textContent=t('Uploading the image, please wait...','بيرفع الصورة، استنى شوية...');
    try{path=await upImage(file);pv.src=path;msg.textContent='';ok.disabled=false}catch(e){msg.className='msg err';msg.textContent=e.message}};
  const send=async body=>{ok.disabled=true;const r=await req('/api/admin/images','PUT',body),j=r.j;
    if(r.ok){await apply(j);dlg.close()}else{msg.className='msg err';msg.textContent=errT(j.error||'Error')}};
  form.onsubmit=e=>{e.preventDefault();send({key:key,url:path})};rs.onclick=()=>send({key:key,reset:true});
  row.append(ok,no,rs);form.appendChild(row);dlg.replaceChildren(form);dlg.showModal();
}
document.addEventListener('click',e=>{
  if(!document.body.classList.contains('textedit')||e.target.closest('.abar,dialog'))return;
  const im=e.target.closest('img[data-o]');
  if(im){e.preventDefault();e.stopPropagation();imageEditor(im);return}
  const el=e.target.closest('[data-ar]');if(!el)return;
  e.preventDefault();e.stopPropagation();textEditor(el);
},true);

/* floating bar */
const needFor=k=>k.startsWith('cats:')?(k==='cats:shop'?'products.edit':'portfolio.edit'):k==='ship'?'shipping.manage':k==='products'?'products.edit':'portfolio.edit';
const bar=document.createElement('div');bar.className='abar';
function drawBar(){
  bar.replaceChildren();const b=document.createElement('b');b.textContent='✎ '+(ME.role==='admin'?t('Admin','الأدمن'):(ME.title||t('Team','الفريق')));bar.appendChild(b);
  (ACTIONS[here]||[]).filter(a=>can(needFor(a[2]))).forEach(([en,a,k])=>{const x=btn('',t(en,a));x.onclick=()=>k.startsWith('cats:')?catEditor(k.slice(5)):k==='ship'?shipEditor():editor(k);bar.appendChild(x)});
  if(can('content.edit')){
    const on=document.body.classList.contains('textedit'),tx=btn(on?'on':'',on?t('Done editing','خلّصت التعديل'):t('Edit page','تعديل الصفحة'));
    tx.onclick=()=>{document.body.classList.toggle('textedit');drawBar()};bar.appendChild(tx);
    const so=btn('',t('Social links','لينكات السوشيال'));so.onclick=()=>editor('social');bar.appendChild(so);
    const c=btn('',t('Contact info','بيانات التواصل'));c.onclick=()=>editor('contact');bar.appendChild(c);
  }
  const d=document.createElement('a');d.href=adminHome(ME);d.textContent=t('Admin pages','صفحات الإدارة');bar.appendChild(d);
  const o=btn('',t('Logout','خروج'));o.onclick=async()=>{await post('/api/logout',{});location.href='index.html'};bar.appendChild(o);
}
document.body.appendChild(bar);drawBar();document.addEventListener('langchange',drawBar);

/* per-item edit buttons */
function decorate(){
  document.querySelectorAll('[data-k]:not([data-ed])').forEach(el=>{
    el.dataset.ed=1;if(!can(el.dataset.k==='products'?'products.edit':'portfolio.edit'))return;const b=document.createElement('button');b.className='edit';b.type='button';b.textContent='✎';b.setAttribute('aria-label','Edit');
    b.onclick=e=>{e.preventDefault();e.stopPropagation();editor(el.dataset.k,el.dataset.id)};
    el.appendChild(b);
  });
  document.querySelectorAll('[data-btn]:not([data-ed])').forEach(el=>{
    el.dataset.ed=1;if(!can('content.edit'))return;const b=document.createElement('button');b.className='edit inl';b.type='button';b.textContent='✎';b.setAttribute('aria-label','Edit button');
    b.onclick=e=>{e.preventDefault();editor('buttons',el.dataset.btn)};el.insertAdjacentElement('afterend',b);
  });
}
let q;new MutationObserver(()=>{cancelAnimationFrame(q);q=requestAnimationFrame(decorate)}).observe(document.body,{childList:true,subtree:true});
decorate();
})();
