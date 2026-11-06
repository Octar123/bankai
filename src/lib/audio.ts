let ac: AudioContext | null = null;

function ctx(): AudioContext {
    if(!ac) {
        const Ctor = window.AudioContext ?? (window as any).webkitAudioContext;
        ac = new Ctor();
    }
    return ac;
}

function noise(a: AudioContext, dur: number): AudioBuffer {
    const buf = a.createBuffer(1, Math.floor(a.sampleRate * dur), a.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return buf;
}

export function unlockAudio(){
    const a = ctx();
    if (a.state === 'suspended') void a.resume();
}

export function playRelease(tone: {freq: number; filter: number; dur: number}){
    const a = ctx();
    if(a.state === 'suspended') void a.resume();
    const now = a.currentTime;

    const osc = a.createOscillator();
    const og = a.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(tone.freq, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, tone.freq * 0.35), now + 0.6);
    og.gain.setValueAtTime(0.0001, now);
    og.gain.exponentialRampToValueAtTime(0.6, now + 0.02);
    og.gain.exponentialRampToValueAtTime(0.0001, now + tone.dur);
    osc.connect(og).connect(a.destination);
    osc.start(now);
    osc.stop(now + tone.dur + 0.05);

    const src = a.createBufferSource();
    src.buffer = noise(a, tone.dur);
    const bp = a.createBiquadFilter();
    bp.type = 'bandpass';
    bp.Q.value = 1.4;
    bp.frequency.setValueAtTime(tone.filter, now);
    bp.frequency.exponentialRampToValueAtTime(tone.filter * 3, now + tone.dur * 0.5);
    const ng = a.createGain();
    ng.gain.setValueAtTime(0.0001, now);
    ng.gain.exponentialRampToValueAtTime(0.22, now + 0.02);
    ng.gain.exponentialRampToValueAtTime(0.0001, now + tone.dur);
    src.connect(bp).connect(ng).connect(a.destination);
    src.start(now);
    src.stop(now + tone.dur);
}