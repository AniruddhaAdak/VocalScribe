'use client'

import { useEffect, useState, useMemo, useCallback } from 'react';

interface Ball {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  pulseSpeed: number;
  rotateSpeed: number;
}

const AnimatedBackground = () => {
  const [balls, setBalls] = useState<Ball[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const colors = useMemo(() => [
    'linear-gradient(45deg, #FF6B6B, #FF8E53)',
    'linear-gradient(45deg, #4ECDC4, #45B7D1)',
    'linear-gradient(45deg, #96CEB4, #FFEEAD)',
    'linear-gradient(45deg, #D4A5A5, #FFAAA5)',
    'linear-gradient(45deg, #7F7FD5, #86A8E7)',
    'linear-gradient(45deg, #654EA3, #EAAFC8)',
  ], []);

  const createBall = useCallback((id: number): Ball => ({
    id,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 8 + Math.random() * 24, // Vary sizes between 8vmin and 32vmin
    color: colors[Math.floor(Math.random() * colors.length)],
    pulseSpeed: 2 + Math.random() * 4, // Pulse speed between 2s and 6s
    rotateSpeed: 10 + Math.random() * 20, // Rotate speed between 10s and 30s
  }), [colors]);

  useEffect(() => {
    const newBalls = Array.from({ length: 20 }, (_, i) => createBall(i));
    setBalls(newBalls);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [createBall]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {balls.map((ball) => (
        <div
          key={ball.id}
          className="absolute rounded-full blur-xl animate-float"
          style={{
            left: `${ball.x}%`,
            top: `${ball.y}%`,
            width: `${ball.size}vmin`,
            height: `${ball.size}vmin`,
            background: ball.color,
            animation: `
              float ${10 + Math.random() * 10}s infinite ease-in-out,
              pulse ${ball.pulseSpeed}s infinite alternate ease-in-out,
              rotate ${ball.rotateSpeed}s infinite linear
            `,
            opacity: 0.15,
            transform: `
              translate(
                ${(mousePosition.x / window.innerWidth - 0.5) * 20}px,
                ${(mousePosition.y / window.innerHeight - 0.5) * 20}px
              )
              rotate(0deg)
            `,
            transition: 'transform 0.2s ease-out',
          }}
        />
      ))}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 0.15; }
          100% { transform: scale(1.1); opacity: 0.25; }
        }
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AnimatedBackground;
