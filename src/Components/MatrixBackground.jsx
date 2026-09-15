import { useEffect, useRef } from 'react';

export function MatrixBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationId;
    let columns;
    let drops = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const fontSize = 14;
      columns = Math.floor(canvas.width / fontSize);
      drops = Array(columns).fill(1).map(() => Math.random() * -100);
    };

    const draw = () => {
      // Efecto de estela semi-transparente
      ctx.fillStyle = 'rgba(15, 23, 42, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      ctx.fillStyle = '#0f0'; // Verde Matrix clásico
      ctx.font = '14px monospace';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#0f0';

      for (let i = 0; i < drops.length; i++) {
        const text = Math.random() > 0.5 ? '1' : '0'; // Binario puro
        const x = i * 14;
        const y = drops[i] * 14;

        // Variación de brillo para profundidad
        ctx.fillStyle = Math.random() > 0.95 ? '#fff' : '#0f0';
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
      animationId = requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-40"
    />
  );
}