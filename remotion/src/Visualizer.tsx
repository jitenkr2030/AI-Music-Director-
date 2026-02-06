import React from 'react';
import { 
  useCurrentFrame, 
  useVideoConfig, 
  AbsoluteFill, 
  interpolate
} from 'remotion';

interface VisualizerProps {
  audioData?: number[];
  visualStyle: 'bars' | 'circular' | 'wave' | 'particles';
  colorScheme: 'rainbow' | 'monochrome' | 'gradient' | 'neon';
  sensitivity: number;
}

export const Visualizer: React.FC<VisualizerProps> = ({
  audioData = [],
  visualStyle,
  colorScheme,
  sensitivity
}) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  
  // Simulate audio data (in real implementation, would analyze actual audio)
  const simulatedData = Array.from({ length: 64 }, (_, i) => 
    Math.sin(frame * 0.1 + i * 0.2) * 0.5 + 0.5 + Math.random() * 0.3
  );

  const getColor = (value: number, index: number, total: number): string => {
    switch (colorScheme) {
      case 'rainbow':
        return `hsl(${(index / total) * 360}, 100%, ${50 + value * 30}%)`;
      case 'monochrome':
        return `rgba(255, 255, 255, ${0.3 + value * 0.7})`;
      case 'gradient':
        return `hsl(${280 + value * 60}, 100%, ${60 + value * 20}%)`;
      case 'neon':
        return `hsl(${120 + index * 3}, 100%, ${50 + value * 40}%)`;
      default:
        return '#ffffff';
    }
  };

  return (
    <AbsoluteFill style={{
      background: 'radial-gradient(circle at center, #1a1a2e, #0f0f1e)'
    }}>
      {visualStyle === 'bars' && (
        <BarVisualizer 
          data={simulatedData} 
          getColor={getColor} 
          sensitivity={sensitivity} 
        />
      )}
      {visualStyle === 'circular' && (
        <CircularVisualizer 
          data={simulatedData} 
          getColor={getColor} 
          sensitivity={sensitivity}
          centerX={width / 2}
          centerY={height / 2}
        />
      )}
      {visualStyle === 'wave' && (
        <WaveVisualizer 
          data={simulatedData} 
          getColor={getColor} 
          sensitivity={sensitivity}
          width={width}
          height={height}
        />
      )}
      {visualStyle === 'particles' && (
        <ParticleVisualizer 
          data={simulatedData} 
          getColor={getColor} 
          sensitivity={sensitivity}
          width={width}
          height={height}
          frame={frame}
        />
      )}
    </AbsoluteFill>
  );
};

const BarVisualizer: React.FC<{
  data: number[];
  getColor: (value: number, index: number, total: number) => string;
  sensitivity: number;
}> = ({ data, getColor, sensitivity }) => {
  const barWidth = 100 / data.length;
  
  return (
    <>
      {data.map((value, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            bottom: 0,
            left: `${index * barWidth}%`,
            width: `${barWidth * 0.8}%`,
            height: `${value * 80 * sensitivity}%`,
            background: getColor(value, index, data.length),
            borderRadius: '4px 4px 0 0',
            transform: `scaleY(${0.8 + value * 0.4})`,
            transformOrigin: 'bottom',
            boxShadow: `0 0 20px ${getColor(value, index, data.length)}`
          }}
        />
      ))}
    </>
  );
};

const CircularVisualizer: React.FC<{
  data: number[];
  getColor: (value: number, index: number, total: number) => string;
  sensitivity: number;
  centerX: number;
  centerY: number;
}> = ({ data, getColor, sensitivity, centerX, centerY }) => {
  const radius = 150;
  
  return (
    <>
      {data.map((value, index) => {
        const angle = (index / data.length) * Math.PI * 2;
        const barHeight = value * 100 * sensitivity;
        
        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: centerX,
              top: centerY,
              width: 4,
              height: barHeight,
              background: getColor(value, index, data.length),
              transformOrigin: 'bottom center',
              transform: `rotate(${angle}rad) translateY(-${radius}px)`,
              borderRadius: '2px',
              boxShadow: `0 0 10px ${getColor(value, index, data.length)}`
            }}
          />
        );
      })}
    </>
  );
};

const WaveVisualizer: React.FC<{
  data: number[];
  getColor: (value: number, index: number, total: number) => string;
  sensitivity: number;
  width: number;
  height: number;
}> = ({ data, getColor, sensitivity, width, height }) => {
  const points = data.map((value, index) => {
    const x = (index / data.length) * width;
    const y = height / 2 - (value - 0.5) * height * 0.4 * sensitivity;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg
      width={width}
      height={height}
      style={{ position: 'absolute', top: 0, left: 0 }}
    >
      <polyline
        points={points}
        fill="none"
        stroke={getColor(0.7, 0, 1)}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.5))'
        }}
      />
      
      {/* Add glow effect */}
      <polyline
        points={points}
        fill="none"
        stroke={getColor(0.5, 0, 1)}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          opacity: 0.3,
          filter: 'blur(4px)'
        }}
      />
    </svg>
  );
};

const ParticleVisualizer: React.FC<{
  data: number[];
  getColor: (value: number, index: number, total: number) => string;
  sensitivity: number;
  width: number;
  height: number;
  frame: number;
}> = ({ data, getColor, sensitivity, width, height, frame }) => {
  const particles = data.map((value, index) => {
    const angle = (index / data.length) * Math.PI * 2 + frame * 0.02;
    const distance = 100 + value * 150 * sensitivity;
    const x = width / 2 + Math.cos(angle) * distance;
    const y = height / 2 + Math.sin(angle) * distance;
    const size = 4 + value * 12 * sensitivity;
    
    return (
      <div
        key={index}
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: '50%',
          background: getColor(value, index, data.length),
          transform: 'translate(-50%, -50%)',
          boxShadow: `0 0 ${size}px ${getColor(value, index, data.length)}`,
          opacity: 0.8
        }}
      />
    );
  });

  return <>{particles}</>;
};