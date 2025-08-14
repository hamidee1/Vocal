import { qs, fmtBytes, toQuery } from './utils.js';

(function(){
  const dz = qs('#dropzone');
  const input = qs('#fileInput');
  const form = qs('#uploadForm');
  const preset = qs('#preset');
  const stemsSel = qs('#stems');
  const progressWrap = qs('#progressWrap');
  const progressBar = qs('#progressBar');
  const progressText = qs('#progressText');

  let file = null;

  const pick = () => input.click();
  const onFiles = (files) => {
    if(!files || !files.length) return;
    const f = files[0];
    const max = (window.APP_CONFIG?.MAX_SIZE_MB || 150) * 1024 * 1024;
    if(f.size > max){
      alert('الملف أكبر من الحد الأقصى: ' + fmtBytes(max));
      return;
    }
    file = f;
    dz.querySelector('p strong').textContent = f.name;
    dz.querySelector('.muted').textContent = fmtBytes(f.size);
  };

  dz.addEventListener('click', pick);
  dz.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' '){ e.preventDefault(); pick(); } });
  dz.addEventListener('dragover', (e)=>{ e.preventDefault(); dz.classList.add('drag'); });
  dz.addEventListener('dragleave', ()=> dz.classList.remove('drag'));
  dz.addEventListener('drop', (e)=>{ e.preventDefault(); dz.classList.remove('drag'); onFiles(e.dataTransfer.files); });
  input.addEventListener('change', (e)=> onFiles(e.target.files));

  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    if(!file){ alert('يرجى اختيار ملف'); return; }

    // Demo-only fake upload/progress then redirect to result
    progressWrap.classList.remove('hidden');
    let p = 0;
    const t = setInterval(()=>{
      p = Math.min(100, p + Math.random()*15);
      progressBar.style.width = p + '%';
      progressText.textContent = 'جاري الرفع… ' + Math.floor(p) + '%';
      if(p>=100){
        clearInterval(t);
        progressText.textContent = 'تم الرفع — جارٍ التحضير…';
        setTimeout(()=>{
          const q = toQuery({ name: file.name, preset: preset.value, stems: stemsSel.value });
          location.href = 'result.html?' + q;
        }, 700);
      }
    }, 200);

    // ملاحظة: عند الربط الحقيقي
    // 1) اطلب presigned URL من API
    // 2) ارفع multi-part
    // 3) أنشئ Job واحصل على job_id
    // 4) انتقل لصفحة result.html?job=... وتابع عبر SSE/WS
  });
})();