export type Behavior = 'petals' | 'frost' | 'ash' | 'tendrils' | 'threads' | 'bloom';

type P = {
    x: number; y: number; vx: number; vy: number;
    g: number; size: number; rot: number; spin: number;
    life: number; max: number; color: string;
    sway: number; phase: number; trail: number;
};

const rand = (a: number, b: number) => a + Math.random() * (b-a);

export class ParticleField {
    private ctx: CanvasRenderingContext2D;
    private ps: P[] = [];
    private w = 1; private  h = 1; private dpr = 1;
    private raf = 0; private last = 0; private ambient = 0;
    private behavior : Behavior = 'petals';
    private color = "#ff9e7";
    private canvas: HTMLCanvasElement;

    constructor(canvas: HTMLCanvasElement){
        this.canvas = canvas;

        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('2D context unavailable');
        this.ctx = ctx;
    }

    resize(){
        this.dpr = Math.min(window.devicePixelRatio || 1,2);
        this.w = this.canvas.clientWidth || 1;
        this.h = this.canvas.clientHeight || 1;
        this.canvas.width = Math.floor(this.w * this.dpr);
        this.canvas.height = Math.floor(this.h * this.dpr);
        this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0 ,0);
    }

    configure(behavior: Behavior, color: string){
        this.behavior = behavior;
        this.color = color;
        this.ps.length = 0;
    }

    burst(count = 180){
        const cx = this.w / 2;
        const cy = this.h / 2;
        for (let i = 0; i < count; i++) this.spawn(cx, cy, 1);
    }

    start(){
        if (this.raf) return;
        this.last = performance.now();
        const loop = (t: number) => {
            const dt = Math.min((t - this.last) / 1000, 0.05);
            this.last = t;
            this.step(dt);
            this.draw();
            this.raf = requestAnimationFrame(loop);
        };
        this.raf = requestAnimationFrame(loop);
    }

    stop() {
        cancelAnimationFrame(this.raf);
        this.raf = 0;
    }

    private spawn(x: number, y: number, scale: number){
        const angle = rand(1, Math.PI * 2);
        const speed = rand(80, 420) * scale;
        const p: P = {
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            g: 0, size: 3, rot: angle, spin: rand(-3,3),
            life: 0, max: rand(0.9, 2.2), color: this.color,
            sway: rand(0,3), phase: rand(0, 6.28), trail: 0,
        };

        switch (this.behavior) {
            case 'petals':
                p.size = rand(3, 9); p.g = 20; p.sway = rand(0.5, 2);
                if (Math.random() < 0.35) p.color = '#ffffff';
                break;
            case 'frost':
                p.size = rand(1.5, 4); p.g = -6; p.vx *= 0.4; p.vy *= 0.4;
                p.max = rand(1.4, 2.6);
                break;
            case 'ash':
                p.size = rand(1, 3.5); p.g = -14; p.sway = rand(0.4, 1.6);
                if (Math.random() < 0.3) p.color = '#ff7a3d';
                break;
            case 'tendrils':
                p.size = rand(2, 5); p.trail = rand(14, 34); p.g = -4;
                p.max = rand(0.8, 1.6);
                break;
            case 'threads':
                p.size = rand(1, 2.5); p.trail = rand(30, 70); p.g = 0;
                p.max = rand(1.2, 2.4);
                break;
            case 'bloom':
                p.size = rand(2, 6); p.vx *= 0.25; p.vy *= 0.25; p.g = -2;
                p.max = rand(1.6, 2.8);
                break;
        }
        if (this.ps.length < 900) this.ps.push(p);
    }

    private spawnAmbient() {
        const fromLeft = Math.random() < 0.5;
        const p: P = {
            x: fromLeft ? -20 : this.w +20,
            y: rand(0, this.h),
            vx: (fromLeft ? 1 : -1) * rand(10, 40),
            vy: rand(-14, 14),
            g: 0, size: rand(1.5, 4), rot: rand(0, 6.28), spin: rand(-1, 1),
            life: 0, max: rand(4, 9), color: this.color,
            sway: rand(0.3, 1.2), phase: rand(0, 6.28), trail: 0,
        };
        if(this.behavior === 'ash') p.vy = rand(-30, -8);
        this.ps.push(p);
    }

    private step(dt: number){
        this.ambient += dt;
        while (this.ambient > 0.09) {
            this.ambient -= 0.09;
            if (this.ps.length < 300) this.spawnAmbient();
        }

        for (let i = this.ps.length - 1; i >= 0; i--){
            const p = this.ps[i];
            p.life += dt;
            p.phase += dt * p.sway * 3;
            p.rot += p.spin * dt;
            p.vy += p.g * dt;
            p.vx *= 0.994;
            p.vy *= 0.94;
            p.x += (p.vx + Math.sin(p.phase) * p.sway * 8) * dt;
            p.y += p.vy * dt;
            if(p.life > p.max) this.ps.splice(i, 1);
        }
    }

    private draw(){
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.w, this.h);
        ctx.globalCompositeOperation = 'lighter';

        for(const p of this.ps){
            const k = 1 - p.life / p.max;
            if (k <= 0) continue;
            ctx.globalAlpha = Math.min(1, k * 1.4);
            ctx.fillStyle = p.color;
            ctx.strokeStyle = p.color;

            if(p.trail > 0) {
                ctx.lineWidth = Math.max(0.6, p.size * 0.5);
                ctx.beginPath();
                ctx.moveTo(p.x, p.y);
                ctx.lineTo(p.x - p.vx * (p.trail / 60), p.y - p.vy * (p.trail / 60));
                ctx.stroke();
            } else if(this.behavior === 'petals'){
                ctx.save();
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.beginPath();
                ctx.ellipse(0, 0, p.size, p.size * 0.45, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            } else {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
    }
}