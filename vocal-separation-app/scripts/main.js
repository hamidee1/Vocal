// Main: demo WebAudio beep (home page demo)
(function(){
  const play = document.getElementById('demoPlay');
  const stop = document.getElementById('demoStop');
  if(!play || !stop) return;
  let ctx, osc, gain;
  play.addEventListener('click', () => {
    if(!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    osc = ctx.createOscillator();
    gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.value = 220;
    gain.gain.value = 0.05;
    osc.connect(gain).connect(ctx.destination);
    osc.start();
  });
  stop.addEventListener('click', () => {
    try{ osc && osc.stop(); }catch(e){}
  });
})();
