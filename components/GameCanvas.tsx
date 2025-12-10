
import React, { useRef, useEffect } from 'react';
import { GameStateRef, GameStatus } from '../types';
import { ENTITY_CONFIG, FOCAL_LENGTH } from '../constants';

interface GameCanvasProps {
  gameStateRef: React.MutableRefObject<GameStateRef>;
  status: GameStatus;
  onInteract: (id: string, x: number, y: number) => void;
  update: (timestamp: number) => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ gameStateRef, status, onInteract, update }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reqRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const render = (timestamp: number) => {
      if (status === GameStatus.PLAYING) {
          update(timestamp);
      }

      // Resize
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }

      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height / 2;
      const state = gameStateRef.current;

      // Clear
      ctx.fillStyle = '#00000000'; // Transparent
      ctx.clearRect(0, 0, width, height);

      // --- 1. Background / Warp Speed ---
      if (status === GameStatus.PLAYING) {
        drawStarfield(ctx, width, height, state.isFeverMode, timestamp);
      }

      // --- 2. Camera Shake ---
      ctx.save();
      if (state.shakeIntensity > 0) {
          const dx = (Math.random() - 0.5) * state.shakeIntensity;
          const dy = (Math.random() - 0.5) * state.shakeIntensity;
          ctx.translate(dx, dy);
      }

      // --- 3. Entities ---
      // Sort by Z (far to near)
      const renderList = [...state.entities].sort((a, b) => b.z - a.z);

      renderList.forEach(entity => {
         const scale = FOCAL_LENGTH / (FOCAL_LENGTH + entity.z);
         if (scale < 0) return; // Behind camera
         
         const x = cx + entity.x * scale;
         const y = cy + entity.y * scale;
         const size = 60 * scale;
         const config = ENTITY_CONFIG[entity.type];

         // Draw Trail
         if (entity.trail.length > 1) {
             ctx.beginPath();
             ctx.strokeStyle = config.color;
             ctx.lineWidth = 4 * scale;
             ctx.lineCap = 'round';
             ctx.globalAlpha = 0.4 * entity.opacity;
             entity.trail.forEach((p, i) => {
                 const s = FOCAL_LENGTH / (FOCAL_LENGTH + p.z);
                 const tx = cx + p.x * s;
                 const ty = cy + p.y * s;
                 if (i === 0) ctx.moveTo(tx, ty);
                 else ctx.lineTo(tx, ty);
             });
             ctx.stroke();
         }

         // Draw Entity (Icon)
         ctx.globalAlpha = entity.opacity;
         drawEntityIcon(ctx, x, y, size, entity.rotation, config.icon, config.color, state.isFeverMode);
         ctx.globalAlpha = 1;
      });

      // --- 4. Particles ---
      state.particles.forEach(p => {
          const scale = FOCAL_LENGTH / (FOCAL_LENGTH + p.z);
          const x = cx + p.x * scale;
          const y = cy + p.y * scale;
          const size = p.size * scale;
          
          ctx.globalAlpha = p.life;
          
          if (p.type === 'text') {
              ctx.font = `900 ${size * 2}px Outfit, sans-serif`;
              ctx.fillStyle = p.color;
              ctx.textAlign = 'center';
              ctx.shadowColor = 'black';
              ctx.shadowBlur = 4;
              ctx.fillText(p.text || '', x, y);
              ctx.shadowBlur = 0;
          } else if (p.type === 'ring') {
              ctx.strokeStyle = p.color;
              ctx.lineWidth = 2 * scale;
              ctx.beginPath();
              ctx.arc(x, y, size, 0, Math.PI * 2);
              ctx.stroke();
          } else {
              // Spark
              ctx.fillStyle = p.color;
              ctx.beginPath();
              ctx.arc(x, y, size/2, 0, Math.PI * 2);
              ctx.fill();
          }
      });
      ctx.globalAlpha = 1;

      ctx.restore(); // Restore shake

      // Overlays
      if (state.freezeActive) {
          ctx.fillStyle = 'rgba(6, 182, 212, 0.1)';
          ctx.fillRect(0, 0, width, height);
      }

      reqRef.current = requestAnimationFrame(render);
    };

    reqRef.current = requestAnimationFrame(render);
    return () => cancelAnimationFrame(reqRef.current);
  }, [status, update]);

  const handleInput = (clientX: number, clientY: number) => {
      if (status !== GameStatus.PLAYING) return;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      
      const width = rect.width;
      const height = rect.height;
      const cx = width / 2;
      const cy = height / 2;

      const state = gameStateRef.current;
      
      for (let i = state.entities.length - 1; i >= 0; i--) {
          const entity = state.entities[i];
          const scale = FOCAL_LENGTH / (FOCAL_LENGTH + entity.z);
          const x = cx + entity.x * scale;
          const y = cy + entity.y * scale;
          const size = 100 * scale; // Increased Hitbox for better UX

          const dx = clientX - x;
          const dy = clientY - y;
          if (dx*dx + dy*dy < (size/2)*(size/2)) {
              onInteract(entity.id, clientX, clientY);
              return; 
          }
      }
  };

  return (
    <canvas 
        ref={canvasRef}
        className="absolute inset-0 z-30 touch-none"
        onPointerDown={(e) => handleInput(e.clientX, e.clientY)}
    />
  );
};

// --- Rendering Helpers ---

function drawEntityIcon(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rot: number, icon: string, color: string, glow: boolean) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rot * Math.PI / 180);
    
    // Draw Box/Container
    const boxSize = size * 1.2;
    
    // Glow effect
    ctx.shadowColor = color;
    ctx.shadowBlur = glow ? 40 : 20;
    
    // Wireframe Box
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.fillStyle = color + '20'; // Semi-transparent fill

    // 3D-ish Box Shape (Square with corners)
    ctx.beginPath();
    const r = boxSize / 2;
    ctx.moveTo(-r, -r);
    ctx.lineTo(r, -r);
    ctx.lineTo(r, r);
    ctx.lineTo(-r, r);
    ctx.closePath();
    ctx.stroke();
    ctx.fill();

    // Render Icon (Emoji/Text)
    ctx.shadowBlur = 0; // Reset shadow for text to be crisp
    ctx.font = `${size}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`; 
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#fff';
    ctx.fillText(icon, 0, 5); // Offset slightly for vertical center

    ctx.restore();
}

function drawStarfield(ctx: CanvasRenderingContext2D, width: number, height: number, fast: boolean, time: number) {
    const cx = width/2;
    const cy = height/2;
    
    ctx.fillStyle = fast ? '#ffffff' : '#666666';
    
    for(let i=0; i<100; i++) {
        const seed = i * 1337;
        let z = (seed + time * (fast ? 2 : 0.5)) % 1000; 
        if (z < 0) z += 1000;
        
        const spread = 2000;
        const sx = ((seed * 9301 + 49297) % spread) - spread/2;
        const sy = ((seed * 49297 + 9301) % spread) - spread/2;

        const scale = FOCAL_LENGTH / (FOCAL_LENGTH + z);
        const x = cx + sx * scale;
        const y = cy + sy * scale;
        const size = (1 - z/1000) * 3;

        if (z < 1000 && z > 0) {
            ctx.globalAlpha = 1 - z/1000;
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI*2);
            ctx.fill();
            
            if (fast) {
                const prevScale = FOCAL_LENGTH / (FOCAL_LENGTH + z + 50);
                const px = cx + sx * prevScale;
                const py = cy + sy * prevScale;
                ctx.beginPath();
                ctx.moveTo(px, py);
                ctx.lineTo(x, y);
                ctx.strokeStyle = `rgba(255,255,255,${ctx.globalAlpha * 0.5})`;
                ctx.lineWidth = size;
                ctx.stroke();
            }
        }
    }
    ctx.globalAlpha = 1;
}
