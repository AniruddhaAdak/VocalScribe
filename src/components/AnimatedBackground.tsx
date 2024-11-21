import { useEffect, useState } from 'react';

const AnimatedBackground = () => {
  const [balls, setBalls] = useState<Array<{ id: number; x: number; y: number; color: string }>>([]);

  useEffect(() => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5'];
    const newBalls = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: colors[Math.floor(Math.random() * colors.length)]
    }));
    setBalls(newBalls);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {balls.map((ball) => (
        <div
          key={ball.id}
          className="absolute w-16 h-16 rounded-full blur-xl animate-float opacity-20"
          style={{
            left: `${ball.x}%`,
            top: `${ball.y}%`,
            backgroundColor: ball.color,
            animation: `float ${10 + Math.random() * 10}s infinite ease-in-out`
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;