import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import type { Bankai } from "../data/bankai";
import { ParticleField } from "../lib/particles";
import { playRelease, unlockAudio } from "../lib/audio";

const HOLD_MS = 1400;

export function Reveal({ bankai }: { bankai: Bankai }){
    const stage = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const jpRef = useRef<HTMLHeadingElement>(null);
    const enRef = useRef<HTMLHeadingElement>(null);
    const loreRef = useRef<HTMLParagraphElement>(null);
    const metaRef = useRef<HTMLDivElement>(null);
    const flashRef = useRef<HTMLDivElement>(null);

    const field = useRef<ParticleField | null>(null);
    const holding = useRef(false);
    const charge = useRef(0);
    const raf = useRef(0);
    const done = useRef(false);
    const [released, setReleased] = useState(false);

    useEffect(() => {
        const c = canvasRef.current;
        if (!c) return;
        const f = new ParticleField(c);
        f.resize();
        f.configure(bankai.behavior, bankai.accent);
        f.start();
        field.current = f;

        const onResize = () => f.resize();
        window.addEventListener('resize', onResize);
        return () => {
            window.removeEventListener('resize', onResize);
            f.stop();
            field.current = null;
        };
    }, [bankai]);

    const setRing = (p: number) => {
        ringRef.current?.style.setProperty('--p', String(p));
    };

    const release = () => {
        if (done.current) return;
        done.current = true;
        charge.current = 1;
        setRing(1);
        setReleased(true);

        field.current?.burst(200);
        playRelease(bankai.tone);

        const tl = gsap.timeline();
        tl.to(ringRef.current, { scale: 1.35, opacity: 0, duration: 0.35, ease: 'power2.out'}, 0)
        .fromTo(flashRef.current, { opacity: 0.9}, {opacity: 0, duration: 0.7, ease: 'power2.out'}, 0)
        .fromTo(
        jpRef.current,
        { opacity: 0, y: 50, scale: 1.18, filter: 'blur(14px)' },
        { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 1.0, ease: 'expo.out' },
        0.05,
      )
      .fromTo(
        enRef.current,
        { opacity: 0, y: 24, letterSpacing: '0.7em' },
        { opacity: 1, y: 0, letterSpacing: '0.18em', duration: 0.9, ease: 'power3.out' },
        0.3,
      )
      .fromTo(loreRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.7 }, 0.6)
      .fromTo(metaRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 0.75);

      gsap.fromTo(
        stage.current,
        {x: 0, y: 0},
        {
            keyframes: [
                { x: -10, y: 5 }, { x: 8, y: -6 }, { x: -5, y: 3 }, { x: 0, y: 0 },
            ],
            duration: 0.5,
            ease: 'power2.out',
        },
      );
    };

    const startHold = () => {
        if (done.current) return;
        unlockAudio();
        holding.current = true;
        const t0 = performance.now() - charge.current * HOLD_MS;

        const tick = () => {
            if (!holding.current) return;
            const p = Math.min((performance.now() - t0) / HOLD_MS, 1);
            charge.current = p;
            setRing(p);
            if(p >= 1){
                holding.current = false;
                release();
                return;
            }
            raf.current = requestAnimationFrame(tick);
        };
        cancelAnimationFrame(raf.current);
        raf.current = requestAnimationFrame(tick);
    };

    const endHold = () => {
        holding.current = false;
        cancelAnimationFrame(raf.current);
        if (done.current || charge.current <= 0) return;

        const from = charge.current;
        const t0 = performance.now();
        const drain = () => {
            const k = Math.min((performance.now() - t0) / 400, 1);
            charge.current = from * (1 - k);
            setRing(charge.current);
            if(k < 1) requestAnimationFrame(drain);
            else charge.current = 0;
        };
        requestAnimationFrame(drain);
    };

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.code === 'Space' || e.code === 'Enter') && !e.repeat){
                e.preventDefault();
                startHold();
            }
        };

        const onKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space' || e.code === 'Enter') endHold();
        };
        window.addEventListener('keydown', onKeyDown);
        window.addEventListener('keyup', onKeyUp);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
            window.removeEventListener('keyup', onKeyUp);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const stat = (label: string, v: number) => (
        <div className="stat" key={label}>
            <span>{label}</span>
            <div className="bar"><i style={{ width: `${v}%`}} /></div>
        </div>
    );

    return (
        <div
            ref={stage}
            className="stage"
            data-released={released}
            style={{ ['--accent' as string]: bankai.accent }}
            >
                <canvas ref={canvasRef} className="fx" />
                <div ref={flashRef} className="flash" />

                {!released && (
                    <div className="sealed">
                        <p className="shikai">{bankai.shikai}</p>
                        <p className="command">“{bankai.command}”</p>

                        <div
                            ref={ringRef}
                            className="ring"
                            role="button"
                            tabIndex={0}
                            aria-label="Hold to release Bankai"
                            onPointerDown={(e) => {e.preventDefault(); startHold();}}
                            onPointerUp={endHold}
                            onPointerLeave={endHold}
                            onPointerCancel={endHold}
                        >
                            <span>HOLD</span>
                        </div>
                        <p className="hint">hold · or press space</p>
                    </div>
                )}

                <div className="revealed">
                    <h1 ref={jpRef} className="jp">{bankai.bankai.jp}</h1>
                    <h2 ref={enRef} className="en">{bankai.bankai.en}</h2>
                    <p ref={loreRef} className="lore">{bankai.lore}</p>
                    <div ref={metaRef} className="meta">
                        <div className="owner">{bankai.user}</div>
                        <div className="stats">
                            {stat('ATK', bankai.stats.attack)}
                            {stat('SPD', bankai.stats.speed)}
                            {stat('RNG', bankai.stats.range)}
                            {stat('REI', bankai.stats.reiatsu)}
                        </div>
                    </div>
                </div> 
        </div>
    );

}