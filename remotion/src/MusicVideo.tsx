import React from 'react';
import { 
  useCurrentFrame, 
  useVideoConfig, 
  AbsoluteFill, 
  interpolate, 
  spring,
  Easing
} from 'remotion';
import { z } from 'zod';

export const musicVideoSchema = z.object({
  songTitle: z.string(),
  artistName: z.string(),
  audioUrl: z.string(),
  mood: z.string(),
  genre: z.string(),
  albumArt: z.string().optional(),
  lyrics: z.array(z.object({
    text: z.string(),
    startTime: z.number(),
    endTime: z.number()
  })).optional(),
  visualStyle: z.enum(['abstract', 'geometric', 'organic', 'tech']).default('abstract')
});

type MusicVideoProps = z.infer<typeof musicVideoSchema>;

export const MusicVideo: React.FC<MusicVideoProps> = ({
  songTitle,
  artistName,
  mood,
  genre,
  albumArt,
  lyrics,
  visualStyle
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  
  const time = frame / fps;
  const progress = frame / durationInFrames;

  // Audio-reactive animations (simulated - in real implementation, would analyze audio)
  const bassIntensity = Math.sin(time * 2) * 0.5 + 0.5;
  const trebleIntensity = Math.cos(time * 4) * 0.5 + 0.5;
  const energy = Math.sin(time * 3) * Math.cos(time * 1.5) * 0.5 + 0.5;

  // Background gradient based on mood
  const getMoodColors = (mood: string) => {
    const moods: Record<string, { from: string; to: string }> = {
      happy: { from: '#FFD700', to: '#FF69B4' },
      sad: { from: '#4169E1', to: '#191970' },
      energetic: { from: '#FF4500', to: '#FFD700' },
      calm: { from: '#87CEEB', to: '#98FB98' },
      romantic: { from: '#FF69B4', to: '#FFB6C1' },
      mysterious: { from: '#4B0082', to: '#8A2BE2' }
    };
    return moods[mood] || moods.happy;
  };

  const colors = getMoodColors(mood);

  // Animated background
  const backgroundScale = 1 + bassIntensity * 0.2;
  const backgroundRotation = frame * 0.5;

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(${backgroundRotation}deg, ${colors.from}, ${colors.to})`,
      transform: `scale(${backgroundScale})`
    }}>
      {/* Animated particles/elements based on visual style */}
      {visualStyle === 'abstract' && <AbstractParticles energy={energy} />}
      {visualStyle === 'geometric' && <GeometricShapes time={time} />}
      {visualStyle === 'organic' && <OrganicForms progress={progress} />}
      {visualStyle === 'tech' && <TechElements bassIntensity={bassIntensity} />}

      {/* Song title and artist */}
      <div style={{
        position: 'absolute',
        top: 100,
        left: 50,
        right: 50,
        textAlign: 'center',
        color: 'white',
        fontSize: 60,
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        transform: `scale(${1 + Math.sin(progress * Math.PI * 2) * 0.1})`,
        opacity: 1 - Math.max(0, (progress - 0.8) * 5) // Fade out at end
      }}>
        {songTitle}
      </div>

      <div style={{
        position: 'absolute',
        top: 180,
        left: 50,
        right: 50,
        textAlign: 'center',
        color: 'white',
        fontSize: 36,
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        opacity: 1 - Math.max(0, (progress - 0.8) * 5)
      }}>
        {artistName}
      </div>

      {/* Lyrics display */}
      {lyrics && <LyricDisplay lyrics={lyrics} currentTime={time} />}

      {/* Visual equalizer */}
      <VisualEqualizer bassIntensity={bassIntensity} trebleIntensity={trebleIntensity} />

      {/* Album art */}
      {albumArt && (
        <div style={{
          position: 'absolute',
          bottom: 100,
          right: 100,
          width: 200,
          height: 200,
          borderRadius: 15,
          backgroundImage: `url(${albumArt})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          transform: `rotate(${Math.sin(time * 2) * 5}deg) scale(${1 + energy * 0.1})`
        }} />
      )}
    </AbsoluteFill>
  );
};

// Component for abstract particle effects
const AbstractParticles: React.FC<{ energy: number }> = ({ energy }) => {
  const particles = Array.from({ length: 20 }, (_, i) => {
    const delay = i * 0.1;
    const size = 20 + energy * 30;
    const x = 50 + Math.sin(i * 0.5) * 30;
    const y = 50 + Math.cos(i * 0.7) * 30;
    
    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: `${x}%`,
          top: `${y}%`,
          width: size,
          height: size,
          borderRadius: '50%',
          background: `rgba(255, 255, 255, ${0.3 + energy * 0.4})`,
          filter: 'blur(2px)',
          transform: `scale(${1 + Math.sin(i + energy * Math.PI * 2) * 0.5})`,
          animation: `float ${3 + delay}s ease-in-out infinite`
        }}
      />
    );
  });

  return <>{particles}</>;
};

// Component for geometric shapes
const GeometricShapes: React.FC<{ time: number }> = ({ time }) => {
  return (
    <>
      <div style={{
        position: 'absolute',
        width: 300,
        height: 300,
        border: '3px solid rgba(255,255,255,0.3)',
        borderRadius: 20,
        left: '10%',
        top: '20%',
        transform: `rotate(${time * 30}deg) scale(${1 + Math.sin(time * 2) * 0.2})`
      }} />
      <div style={{
        position: 'absolute',
        width: 200,
        height: 200,
        background: 'rgba(255,255,255,0.1)',
        borderRadius: '50%',
        right: '15%',
        bottom: '25%',
        transform: `rotate(${-time * 45}deg) scale(${1 + Math.cos(time * 3) * 0.3})`
      }} />
    </>
  );
};

// Component for organic forms
const OrganicForms: React.FC<{ progress: number }> = ({ progress }) => {
  return (
    <div style={{
      position: 'absolute',
      width: 400,
      height: 400,
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
      borderRadius: `${50 + Math.sin(progress * Math.PI * 4) * 30}%`,
      filter: 'blur(20px)'
    }} />
  );
};

// Component for tech elements
const TechElements: React.FC<{ bassIntensity: number }> = ({ bassIntensity }) => {
  const bars = Array.from({ length: 20 }, (_, i) => (
    <div
      key={i}
      style={{
        position: 'absolute',
        bottom: 0,
        left: `${i * 5}%`,
        width: '3%',
        height: `${20 + bassIntensity * 60 + Math.random() * 20}%`,
        background: `linear-gradient(to top, rgba(0,255,255,0.8), rgba(255,0,255,0.8))`,
        transform: `scaleY(${0.8 + bassIntensity * 0.4})`
      }}
    />
  ));

  return <>{bars}</>;
};

// Component for lyric display
const LyricDisplay: React.FC<{ 
  lyrics: Array<{ text: string; startTime: number; endTime: number }>;
  currentTime: number;
}> = ({ lyrics, currentTime }) => {
  const currentLyric = lyrics.find(
    l => currentTime >= l.startTime && currentTime <= l.endTime
  );

  if (!currentLyric) return null;

  return (
    <div style={{
      position: 'absolute',
      bottom: 200,
      left: 50,
      right: 50,
      textAlign: 'center',
      color: 'white',
      fontSize: 48,
      fontWeight: 'bold',
      textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
      animation: 'lyricFade 0.5s ease-in-out'
    }}>
      {currentLyric.text}
    </div>
  );
};

// Component for visual equalizer
const VisualEqualizer: React.FC<{ 
  bassIntensity: number; 
  trebleIntensity: number;
}> = ({ bassIntensity, trebleIntensity }) => {
  const bars = Array.from({ length: 30 }, (_, i) => {
    const height = 20 + Math.sin(i * 0.3 + Date.now() * 0.001) * 30 * bassIntensity;
    
    return (
      <div
        key={i}
        style={{
          position: 'absolute',
          bottom: 50,
          left: `${10 + i * 2.5}%`,
          width: '2%',
          height: `${height}%`,
          background: `hsl(${i * 12}, 100%, 60%)`,
          borderRadius: '2px',
          transform: `scaleY(${0.8 + trebleIntensity * 0.4})`
        }}
      />
    );
  });

  return <>{bars}</>;
};