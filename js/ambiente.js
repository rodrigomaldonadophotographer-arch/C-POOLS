// Ambiente sonoro original, generado en el dispositivo y activado solo por decisión de la persona.
const soundButton=document.querySelector('#soundToggle');let audioContext=null,masterGain=null,tones=[];
function startAmbient(){
  const AudioCtx=window.AudioContext||window.webkitAudioContext;if(!AudioCtx)return;
  audioContext=audioContext||new AudioCtx();audioContext.resume();masterGain=audioContext.createGain();masterGain.gain.value=.018;masterGain.connect(audioContext.destination);
  [110,164.81,220].forEach((frequency,index)=>{const oscillator=audioContext.createOscillator(),gain=audioContext.createGain();oscillator.type='sine';oscillator.frequency.value=frequency;gain.gain.value=index===0?.34:.17;oscillator.connect(gain);gain.connect(masterGain);oscillator.start();tones.push(oscillator)});
}
function stopAmbient(){if(masterGain&&audioContext){masterGain.gain.setTargetAtTime(0,audioContext.currentTime,.25);setTimeout(()=>tones.forEach(t=>{try{t.stop()}catch{}}),900);tones=[]}}
soundButton?.addEventListener('click',()=>{const enabled=soundButton.getAttribute('aria-pressed')!=='true';soundButton.setAttribute('aria-pressed',String(enabled));soundButton.classList.toggle('is-on',enabled);soundButton.querySelector('small').textContent=enabled?'ACTIVADO':'DESACTIVADO';enabled?startAmbient():stopAmbient()});
