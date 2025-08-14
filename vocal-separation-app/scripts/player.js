// Demo WebAudio mixer: synthesizes two tones to simulate stems.
import { parseQuery } from './utils.js';

(function(){
  const playBtn = document.getElementById('playBtn');
  const stopBtn = document.getElementById('stopBtn');
  const vocalToggle = document.getElementById('vocalToggle');
  const instToggle = document.getElementById('instToggle');
  const vocalGainEl = document.getElementById('vocalGain');
  const instGainEl = document.getElementById('instGain');

  let ctx, vOsc, iOsc, vGain, iGain, masterGain;
  function ensureCtx(){
    if(!ctx){
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      masterGain = ctx.createGain(); masterGain.gain.value = 0.2; masterGain.connect(ctx.destination);
      vGain = ctx.createGain(); iGain = ctx.createGain(); vGain.connect(masterGain); iGain.connect(masterGain);
    }
  }

  function start(){
    ensureCtx();
    vOsc = ctx.createOscillator();
    iOsc = ctx.createOscillator();
    vOsc.type = 'triangle'; iOsc.type = 'sine';
    vOsc.frequency.value = 440; // vocal
    iOsc.frequency.value = 110; // instrumental
    vOsc.connect(vGain); iOsc.connect(iGain);
    vOsc.start(); iOsc.start();
    applyMix();
  }

  function stop(){
    try{ vOsc && vOsc.stop(); }catch(e){}
    try{ iOsc && iOsc.stop(); }catch(e){}
    vOsc = iOsc = null;
  }

  function applyMix(){
    vGain.gain.value = (vocalToggle.checked ? 1 : 0) * parseFloat(vocalGainEl.value || '1');
    iGain.gain.value = (instToggle.checked ? 1 : 0) * parseFloat(instGainEl.value || '1');
  }

  [vocalToggle, instToggle, vocalGainEl, instGainEl].forEach(el => el && el.addEventListener('input', applyMix));
  playBtn && playBtn.addEventListener('click', start);
  stopBtn && stopBtn.addEventListener('click', stop);

  const q = parseQuery();
  if(q.name) document.title = 'النتائج — ' + q.name;
})();