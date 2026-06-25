import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  type: 'cap' | 'leaf' | 'star' | 'ribbon';
  color: string;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let particles: Particle[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const colors = ['#D4AF37', '#8B0000', '#F0D060', '#CD853F', '#B8860B'];
    const types: Particle['type'][] = ['cap', 'leaf', 'star', 'ribbon'];

    const createParticle = (initialY?: number): Particle => {
      return {
        x: Math.random() * canvas.width,
        y: initialY ?? Math.random() * -canvas.height,
        size: Math.random() * 20 + 10,
        speedY: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.8,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        opacity: Math.random() * 0.6 + 0.3,
        type: types[Math.floor(Math.random() * types.length)],
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    const drawCap = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(0, -p.size * 0.6);
      ctx.lineTo(-p.size * 0.8, 0);
      ctx.lineTo(p.size * 0.8, 0);
      ctx.closePath();
      ctx.fill();

      ctx.fillRect(-p.size * 0.1, 0, p.size * 0.2, p.size * 0.5);

      ctx.strokeStyle = p.color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-p.size * 0.05, p.size * 0.5);
      ctx.quadraticCurveTo(-p.size * 0.15, p.size * 0.7, -p.size * 0.1, p.size * 0.9);
      ctx.stroke();

      ctx.restore();
    };

    const drawLeaf = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size * 0.7, p.size * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(-p.size * 0.6, 0);
      ctx.lineTo(p.size * 0.6, 0);
      ctx.stroke();

      ctx.restore();
    };

    const drawStar = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;

      const spikes = 5;
      const outerRadius = p.size * 0.5;
      const innerRadius = p.size * 0.25;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      for (let i = 0; i < spikes * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / spikes - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const drawRibbon = (p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = p.opacity;

      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.moveTo(-p.size * 0.8, -p.size * 0.15);
      ctx.quadraticCurveTo(-p.size * 0.4, -p.size * 0.3, 0, -p.size * 0.15);
      ctx.quadraticCurveTo(p.size * 0.4, 0, p.size * 0.8, -p.size * 0.15);
      ctx.lineTo(p.size * 0.8, p.size * 0.15);
      ctx.quadraticCurveTo(p.size * 0.4, 0, 0, p.size * 0.15);
      ctx.quadraticCurveTo(-p.size * 0.4, p.size * 0.3, -p.size * 0.8, p.size * 0.15);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    const drawParticle = (p: Particle) => {
      switch (p.type) {
        case 'cap':
          drawCap(p);
          break;
        case 'leaf':
          drawLeaf(p);
          break;
        case 'star':
          drawStar(p);
          break;
        case 'ribbon':
          drawRibbon(p);
          break;
      }
    };

    const updateParticle = (p: Particle) => {
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.y * 0.01) * 0.5;
      p.rotation += p.rotationSpeed;

      if (p.y > canvas.height + 50) {
        p.y = -50;
        p.x = Math.random() * canvas.width;
      }
      if (p.x < -50) p.x = canvas.width + 50;
      if (p.x > canvas.width + 50) p.x = -50;
    };

    const initParticles = () => {
      particles = [];
      const count = Math.min(50, Math.floor((canvas.width * canvas.height) / 25000));
      for (let i = 0; i < count; i++) {
        particles.push(createParticle(Math.random() * canvas.height));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        updateParticle(p);
        drawParticle(p);
      });

      animationId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    const handleResize = () => {
      resizeCanvas();
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}
