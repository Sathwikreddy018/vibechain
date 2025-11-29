import { useEffect, useRef } from 'react';

export default function CardanoOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let rotation = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      const width = canvas.offsetWidth;
      const height = canvas.offsetHeight;
      const centerX = width / 2;
      const centerY = height / 2;

      ctx.clearRect(0, 0, width, height);

      rotation += 0.005;

      const layers = [
        { count: 8, radius: 120, size: 8, opacity: 0.3 },
        { count: 16, radius: 90, size: 6, opacity: 0.5 },
        { count: 24, radius: 60, size: 5, opacity: 0.7 },
        { count: 8, radius: 30, size: 10, opacity: 0.9 },
        { count: 1, radius: 0, size: 20, opacity: 1 }
      ];

      layers.forEach((layer, layerIndex) => {
        const layerRotation = rotation * (1 + layerIndex * 0.2);

        for (let i = 0; i < layer.count; i++) {
          const angle = (i / layer.count) * Math.PI * 2 + layerRotation;
          const x = centerX + Math.cos(angle) * layer.radius;
          const y = centerY + Math.sin(angle) * layer.radius;

          ctx.beginPath();
          ctx.arc(x, y, layer.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 51, 173, ${layer.opacity})`;
          ctx.fill();

          const gradient = ctx.createRadialGradient(x, y, 0, x, y, layer.size * 2);
          gradient.addColorStop(0, `rgba(0, 51, 173, ${layer.opacity * 0.3})`);
          gradient.addColorStop(1, 'rgba(0, 51, 173, 0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, layer.size * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
}
