/* Shared by every admin page (dashboard, orders, coupons, shipping, store, log, accounts) */
let ST=null,PAGE_PERM='',PAGE_DRAW=null;
const ago=s=>{try{return new Date(s).toLocaleString(ar()?'ar-EG':'en-GB',{dateStyle:'medium',timeStyle:'short'})}catch(e){return ''}};
const day=s=>String(s||'').slice(0,10);
const kpi=(n,en,a)=>'<div class="card kpi"><b>'+n+'</b>'+t(en,a)+'</div>';
const tbl=(head,rows)=>'<div class="scroll"><table><tr>'+head.map(h=>'<th>'+h+'</th>').join('')+'</tr>'+rows.join('')+'</table></div>';
const empty=(en,a)=>'<p style="opacity:.7">'+t(en,a)+'</p>';
const ORD={new:['new','جديد'],confirmed:['confirmed','مؤكد'],done:['done','تم'],cancelled:['cancelled','ملغي']};
const CST={active:['Active','شغّال'],disabled:['Disabled','متوقف'],scheduled:['Scheduled','مجدول'],expired:['Expired','انتهى'],'used up':['Used up','خلص عدد الاستخدام']};
const PERM_TXT={
 'dashboard.view':['See the dashboard and statistics','يشوف الداشبورد والإحصائيات'],
 'orders.view':['See orders and invoices','يشوف الطلبات والفواتير'],
 'orders.manage':['Confirm orders, record payments, change status, cancel','يأكد الطلبات ويسجل الدفع ويغيّر الحالة ويلغي'],
 'products.edit':['Add and edit products, courses, stock, shop sections, watermark','يضيف ويعدّل المنتجات والكورسات والمخزون وأقسام المتجر والواترمارك'],
 'portfolio.edit':['Add and edit projects, clients and portfolio sections','يضيف ويعدّل المشاريع والعملاء وأقسام الأعمال'],
 'content.edit':['Edit page texts, images, social links and contact info','يعدّل نصوص وصور الصفحات والسوشيال وبيانات التواصل'],
 'coupons.manage':['Create and manage coupons and their reports','يعمل ويدير الكوبونات وتقاريرها'],
 'shipping.manage':['Edit governorates and shipping fees','يعدّل المحافظات وتكلفة الشحن'],
 'reports.reply':['Read and reply to problem reports','يقرا بلاغات المشاكل ويردّ عليها'],
 'accounts.view':['See the accounts list (no changes)','يشوف قايمة الحسابات (من غير تعديل)'],
 'log.view':['See the activity log','يشوف سجل النشاط']};

/* call the API (the same shim as the rest of the site) */
async function api(route,method,body){
  try{const r=await fetch(route,{method:method||'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body||{})});let j={};try{j=await r.json()}catch(e){j={error:'Bad response'}}return{ok:r.ok,s:r.status,j:j}}
  catch(e){return{ok:false,s:0,j:{error:'Network error: '+e.message}}}
}
async function loadStats(){
  const r=await fetch('/api/admin/stats');
  if(r.status===401||r.status===403){location.href='login.html';return null}
  ST=await r.json();return ST;
}
function adminNav(){
  const cur=(location.pathname.split('/').pop()||'index').replace(/\.html$/,'');
  return '<nav class="anav" aria-label="Admin">'+PAGES.filter(p=>can(p[0])).map(p=>'<a href="'+p[1]+'"'+(p[1].replace('.html','')===cur?' class="on" aria-current="page"':'')+'>'+t(p[2],p[3])+'</a>').join('')+'</nav>';
}
/* every admin page starts here: checks the permission, draws the menu, loads the numbers and calls render() */
function adminPage(perm,render,needsStats){
  PAGE_PERM=perm;PAGE_DRAW=render;
  const start=async()=>{
    if(!isTeam()){location.href='login.html';return}
    if(!can(perm)){$('dash').innerHTML=adminNav()+'<div class="card"><h3>'+t('You do not have access to this page.','معندكش صلاحية للصفحة دي.')+'</h3><p><a class="btn" href="'+adminHome(ME)+'">'+t('Back','رجوع')+'</a></p></div>';return}
    $('dash').innerHTML='<p>…</p>';
    if(needsStats!==false){if(!await loadStats())return}
    draw();
  };
  const draw=()=>{const box=document.createElement('div');box.innerHTML=adminNav();$('dash').replaceChildren(box.firstChild);const body=document.createElement('div');body.id='abody';$('dash').appendChild(body);render(body)};
  window.afterSave=async()=>{if(needsStats!==false)await loadStats();draw()};
  window.redraw=draw;
  document.addEventListener('langchange',()=>{if(ST||needsStats===false)draw()});
  if(window.AUTH_DONE)start();else document.addEventListener('auth',start,{once:true});
}
const lib=src=>new Promise((ok,no)=>{const s=document.createElement('script');s.src=src;s.onload=ok;s.onerror=()=>no(new Error('Could not load '+src));document.head.appendChild(s)});

/* ---------- Excel ---------- */
async function saveXlsx(filename,sheets){
  await lib('vendor/xlsx.mini.min.js');
  const wb=XLSX.utils.book_new();
  sheets.forEach(([name,rows,widths])=>{const ws=XLSX.utils.aoa_to_sheet(rows);if(widths)ws['!cols']=widths.map(w=>({wch:w}));XLSX.utils.book_append_sheet(wb,ws,name.slice(0,30))});
  if(ar())wb.Workbook={Views:[{RTL:true}]};
  XLSX.writeFile(wb,filename);
}

/* ---------- invoice as a PDF (made in the browser, never sent to customers) ---------- */
function invoiceDom(o){
  const ex=o.extra||{},sh=ex.ship,lang=ex.lang||'en',T=(e,a)=>lang==='ar'?a:e,cu=T('EGP','ج.م'),un=u=>({piece:T('piece','قطعة'),meter:T('m','متر'),sheet:T('sheet','ورقة')}[u]||''),al=lang==='ar'?'right':'left',ot=lang==='ar'?'left':'right';
  const ql=i=>(i.pricing==='per'&&i.unit!=='item')?fm(i.q)+' '+un(i.unit):(i.q>1?'× '+i.q:'1'),td='padding:10px 8px;border-bottom:1px solid #e8e6dc;';
  const rows=o.items.map(i=>'<tr><td style="'+td+'text-align:'+al+'">'+esc(i.name)+(i.sku?'<br><small style="color:#888">'+esc(i.sku)+'</small>':'')+'</td><td style="'+td+'text-align:center">'+esc(ql(i))+'</td><td style="'+td+'text-align:center">'+fm(i.price)+'</td><td style="'+td+'text-align:'+ot+'">'+fm(i.q*i.price)+'</td></tr>').join('');
  const sm=(l,v,b)=>'<tr><td colspan="3" style="padding:6px 8px;text-align:'+ot+(b?';font-weight:800;font-size:18px':'')+'">'+l+'</td><td style="padding:6px 8px;text-align:'+ot+(b?';font-weight:800;font-size:18px':'')+'">'+v+'</td></tr>';
  const who=sh?[sh.name,sh.phone,L(sh.regionName)+' - '+sh.address,ex.email].filter(Boolean):[o.user||T('Guest','زائر'),ex.email].filter(Boolean);
  const paid=+ex.paid||0,pay=(o.status==='confirmed'||o.status==='done'||paid>0)?sm(T('Paid','المدفوع'),fm(paid)+' '+cu)+sm(T('Remaining','المتبقي'),fm(o.total-paid)+' '+cu,true):'';
  return '<div style="background:#fe502d;color:#fffdef;padding:26px 36px;display:flex;justify-content:space-between;align-items:center"><img src="logo-cream.png" style="height:46px" alt="Hook"><div style="text-align:'+ot+'"><div style="font-size:26px;font-weight:800">'+T('INVOICE','فاتورة')+'</div><div style="font-size:15px">'+esc(ex.inv||o.id)+'</div></div></div>'
   +'<div style="padding:28px 36px;font-size:14px;line-height:1.7"><div style="display:flex;justify-content:space-between;gap:20px;margin-bottom:22px"><div><b>'+T('Billed to','فاتورة إلى')+'</b><br>'+who.map(x=>esc(x)).join('<br>')+'</div><div style="text-align:'+ot+'"><b>'+T('Date','التاريخ')+'</b><br>'+esc(day(o.at))+'<br><b>'+T('Status','الحالة')+'</b><br>'+esc(T(...(ORD[o.status]||[o.status,o.status])))+'</div></div>'
   +'<table style="width:100%;border-collapse:collapse"><tr style="background:#fdfbee"><th style="'+td+'text-align:'+al+'">'+T('Item','الصنف')+'</th><th style="'+td+'">'+T('Qty','الكمية')+'</th><th style="'+td+'">'+T('Price','السعر')+'</th><th style="'+td+'text-align:'+ot+'">'+T('Total','الإجمالي')+'</th></tr>'+rows
   +sm(T('Subtotal','المجموع'),fm(ex.subtotal!=null?ex.subtotal:o.total)+' '+cu)+(ex.discount?sm(T('Coupon ','كوبون ')+esc((ex.coupon||{}).code||''),'- '+fm(ex.discount)+' '+cu):'')+(sh?sm(T('Shipping','الشحن'),fm(sh.fee)+' '+cu):'')+sm(T('Total','الإجمالي'),fm(o.total)+' '+cu,true)+pay+'</table>'
   +'<p style="margin-top:34px;color:#555;font-size:13px">'+T('Thank you for your order.','شكراً لطلبك.')+'<br>'+esc(DB.contact.email)+' · <span dir="ltr">+'+esc(DB.contact.whatsapp)+'</span></p></div>';
}
async function invoicePdf(o,btn){
  const old=btn.textContent;btn.disabled=true;btn.textContent='...';
  try{
    if(!window.html2canvas)await lib('vendor/html2canvas.min.js');if(!window.jspdf)await lib('vendor/jspdf.umd.min.js');
    const lang=(o.extra&&o.extra.lang)||'en',node=document.createElement('div');
    node.style.cssText='position:fixed;left:-10000px;top:0;width:794px;background:#fff;color:#1d1d1b;font-family:Rubik,Arial,sans-serif;direction:'+(lang==='ar'?'rtl':'ltr');node.innerHTML=invoiceDom(o);document.body.appendChild(node);
    await new Promise(r=>setTimeout(r,150));const cv=await html2canvas(node,{scale:2,backgroundColor:'#ffffff',useCORS:true});node.remove();
    const pdf=new window.jspdf.jsPDF({unit:'pt',format:'a4'}),W=pdf.internal.pageSize.getWidth(),H=pdf.internal.pageSize.getHeight(),ih=cv.height*W/cv.width,img=cv.toDataURL('image/jpeg',.92);
    pdf.addImage(img,'JPEG',0,0,W,ih);let left=ih-H,off=0;while(left>0){pdf.addPage();off-=H;pdf.addImage(img,'JPEG',0,off,W,ih);left-=H}
    pdf.save(((o.extra&&o.extra.inv)||o.id)+'.pdf');
  }catch(e){alert(t('Could not make the PDF: ','معرفناش نعمل الـ PDF: ')+e.message)}
  btn.disabled=false;btn.textContent=old;
}

/* ---------- confirm an order / record a payment ---------- */
function payDialog(o,confirming,done){
  const ex=o.extra||{},d=document.createElement('dialog'),paid0=+ex.paid||0;document.body.appendChild(d);
  d.innerHTML='<form><h3>'+(confirming?t('Confirm the order','تأكيد الطلب'):t('Record a payment','تسجيل دفع'))+' <span dir="ltr">'+esc(ex.inv||'')+'</span></h3>'
   +'<p>'+t('Order total','إجمالي الطلب')+': <b>'+fm(o.total)+' '+cur()+'</b></p>'
   +'<label><span>'+t('Amount paid so far','المبلغ المدفوع لحد دلوقتي')+'</span><input name="paid" type="number" min="0" max="'+o.total+'" step="any" value="'+paid0+'" required></label>'
   +'<p>'+t('Remaining','المتبقي')+': <b id="rem">'+fm(o.total-paid0)+'</b> '+cur()+'</p>'
   +(ex.email?'<label class="chk"><input type="checkbox" name="send" '+(confirming?'checked disabled':'checked')+'><span>'+(confirming?t('The customer gets the confirmation and the invoice by email: ','العميل هيوصله تأكيد الطلب والفاتورة على الإيميل: ')+'<b dir="ltr">'+esc(ex.email)+'</b>':t('Email the updated invoice to ','ابعت الفاتورة المحدّثة على ')+'<b dir="ltr">'+esc(ex.email)+'</b>')+'</span></label>':'<p class="msg">'+t('This order has no email, so nothing will be emailed.','الطلب ده من غير إيميل، فمفيش حاجة هتتبعت.')+'</p>')
   +'<p class="msg err" id="pm"></p><div class="row"><button class="btn" type="submit">'+t('Save','حفظ')+'</button><button class="btn ghost" type="button" id="pc">'+t('Cancel','إلغاء')+'</button></div></form>';
  const f=d.querySelector('form'),inp=f.paid;
  inp.oninput=()=>{d.querySelector('#rem').textContent=fm(Math.max(0,o.total-(+inp.value||0)))};
  const close=()=>{d.close();d.remove()};d.querySelector('#pc').onclick=()=>{close();done&&done(false)};d.addEventListener('cancel',()=>{d.remove();done&&done(false)});
  f.onsubmit=async e=>{e.preventDefault();const body={paid:inp.value};if(confirming)body.status='confirmed';else if(f.send&&f.send.checked)body.sendInvoice=true;
    const b=f.querySelector('[type=submit]');b.disabled=true;const r=await api('/api/admin/orders/'+o.id,'PATCH',body);
    if(r.ok){close();done&&done(true)}else{b.disabled=false;$('pm').textContent=errT(r.j.error||'Error')}};
  d.showModal();
}
