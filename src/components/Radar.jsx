import React, { useEffect, useRef } from 'react';
import '../css/radar.css';

export default function Radar() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let angle = 0;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    // Generate some random "blips"
    const blips = Array.from({ length: 5 }, () => ({
      angle: Math.random() * Math.PI * 2,
      distance: Math.random() * radius,
      opacity: 0
    }));

    let animationFrameId;

    const draw = () => {
      // Clear with slight fade for trails
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid
      ctx.strokeStyle = 'rgba(104, 255, 240, 0.3)';
      ctx.lineWidth = 1;
      
      // Circles
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * (i / 4), 0, Math.PI * 2);
        ctx.stroke();
      }

      // Crosshairs
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX, centerY + radius);
      ctx.moveTo(centerX - radius, centerY);
      ctx.lineTo(centerX + radius, centerY);
      ctx.stroke();

      // Draw Radar Sweep
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(angle);
      
      const gradient = ctx.createConicGradient(0, 0, 0);
      gradient.addColorStop(0, 'rgba(104, 255, 240, 0.8)');
      gradient.addColorStop(0.1, 'rgba(104, 255, 240, 0)');
      gradient.addColorStop(1, 'rgba(104, 255, 240, 0)');
      
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, 0, -Math.PI / 2, true);
      ctx.lineTo(0, 0);
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Sweep Line
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(radius, 0);
      ctx.strokeStyle = 'rgba(104, 255, 240, 1)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.restore();

      // Update & Draw Blips
      blips.forEach(blip => {
        // Check if sweep passed the blip
        // We normalize angles to 0-2PI to compare
        let sweepAngle = (angle % (Math.PI * 2));
        if (sweepAngle < 0) sweepAngle += Math.PI * 2;
        
        let blipAngle = blip.angle;
        
        // Rough collision detection for the sweeping line
        if (Math.abs(sweepAngle - blipAngle) < 0.1) {
          blip.opacity = 1; // Light up!
        }

        if (blip.opacity > 0) {
          ctx.beginPath();
          const bx = centerX + Math.cos(blip.angle) * blip.distance;
          const by = centerY + Math.sin(blip.angle) * blip.distance;
          ctx.arc(bx, by, 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(104, 255, 240, ${blip.opacity})`;
          ctx.fill();
          
          // Outer ping
          ctx.beginPath();
          ctx.arc(bx, by, 8 + (1 - blip.opacity) * 10, 0, Math.PI * 2);
          ctx.strokeStyle = `rgba(104, 255, 240, ${blip.opacity * 0.5})`;
          ctx.stroke();

          blip.opacity -= 0.01; // Fade out
        }
      });

      angle += 0.05;
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="radar-container">
      <canvas ref={canvasRef} width={400} height={400} className="radar-canvas" />
      <div className="radar-stats">
        <p>NETWORK NODES: 5 ONLINE</p>
        <p>SIGNAL STR: 94%</p>
        <p>INTRUSIONS: 0 DETECTED</p>
      </div>
    </div>
  );
}
