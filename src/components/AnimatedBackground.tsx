import React, { useEffect, useRef, useCallback } from 'react';
import { useTheme, Box, alpha } from '@mui/material';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  color: string;
  opacity: number;
}

const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const theme = useTheme();
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  // Create particles with theme colors
  const createParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    const particleCount = Math.floor(width * height / 10000); // Density based on screen size
    
    const colors = [
      theme.palette.primary.light,
      theme.palette.primary.main,
      theme.palette.secondary.light,
      theme.palette.secondary.main,
      theme.palette.info.light,
      theme.palette.success.light,
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 5 + 1,
        speedX: Math.random() * 0.5 - 0.25,
        speedY: Math.random() * 0.5 - 0.25,
        color: colors[Math.floor(Math.random() * colors.length)],
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    return particles;
  }, [theme.palette.primary.light, theme.palette.primary.main, 
      theme.palette.secondary.light, theme.palette.secondary.main, 
      theme.palette.info.light, theme.palette.success.light]);

  // Draw function
  const draw = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);
    
    particlesRef.current.forEach((particle) => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fillStyle = alpha(particle.color, particle.opacity);
      ctx.fill();
      
      // Update position
      particle.x += particle.speedX;
      particle.y += particle.speedY;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > width) {
        particle.speedX = -particle.speedX;
      }
      
      if (particle.y < 0 || particle.y > height) {
        particle.speedY = -particle.speedY;
      }
      
      // Connect particles that are close to each other
      particlesRef.current.forEach((otherParticle) => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 100) {
          ctx.beginPath();
          ctx.strokeStyle = alpha(particle.color, 0.05 * (1 - distance / 100));
          ctx.lineWidth = 0.5;
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.stroke();
        }
      });
    });
    
    animationRef.current = requestAnimationFrame(() => draw(ctx, width, height));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Make canvas responsive
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      
      // Reset particles on resize
      particlesRef.current = createParticles(width, height);
    };
    
    // Initial setup
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Start animation
    draw(ctx, canvas.width, canvas.height);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, [createParticles, draw]);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
        opacity: 0.8,
        pointerEvents: 'none',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
        }}
      />
    </Box>
  );
};

export default AnimatedBackground; 