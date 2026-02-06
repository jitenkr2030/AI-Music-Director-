import React from 'react';
import { 
  useCurrentFrame, 
  useVideoConfig, 
  AbsoluteFill, 
  interpolate,
  spring
} from 'remotion';

interface PromoVideoProps {
  songTitle: string;
  artistName: string;
  genre: string;
  mood: string;
  albumArt?: string;
  description?: string;
  callToAction?: string;
}

export const PromoVideo: React.FC<PromoVideoProps> = ({
  songTitle,
  artistName,
  genre,
  mood,
  albumArt,
  description,
  callToAction = "Listen Now"
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const progress = frame / durationInFrames;

  // Animation timings
  const titleAppear = spring({ frame, fps, config: { damping: 20 } });
  const slideUp = spring({ 
    frame: frame - 30, 
    fps, 
    config: { damping: 15 } 
  });
  const fadeIn = spring({ 
    frame: frame - 60, 
    fps, 
    config: { damping: 25 } 
  });

  // Background based on mood
  const getBackground = (mood: string) => {
    const backgrounds: Record<string, string> = {
      happy: 'linear-gradient(135deg, #FFD700, #FF69B4)',
      energetic: 'linear-gradient(135deg, #FF4500, #FFD700)',
      calm: 'linear-gradient(135deg, #87CEEB, #98FB98)',
      romantic: 'linear-gradient(135deg, #FF69B4, #FFB6C1)',
      mysterious: 'linear-gradient(135deg, #4B0082, #8A2BE2)',
      sad: 'linear-gradient(135deg, #4169E1, #191970)'
    };
    return backgrounds[mood] || backgrounds.happy;
  };

  return (
    <AbsoluteFill style={{
      background: getBackground(mood),
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <BackgroundElements mood={mood} progress={progress} />

      {/* Album Art */}
      {albumArt && (
        <div style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: `translate(-50%, -50%) scale(${titleAppear})`,
          width: 250,
          height: 250,
          borderRadius: 20,
          backgroundImage: `url(${albumArt})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          opacity: titleAppear
        }} />
      )}

      {/* Song Title */}
      <div style={{
        position: 'absolute',
        top: albumArt ? '55%' : '30%',
        left: 40,
        right: 40,
        textAlign: 'center',
        color: 'white',
        fontSize: albumArt ? 42 : 48,
        fontWeight: 'bold',
        textShadow: '2px 2px 8px rgba(0,0,0,0.8)',
        transform: `translateY(${40 * (1 - slideUp)}px)`,
        opacity: slideUp
      }}>
        {songTitle}
      </div>

      {/* Artist Name */}
      <div style={{
        position: 'absolute',
        top: albumArt ? '65%' : '40%',
        left: 40,
        right: 40,
        textAlign: 'center',
        color: 'rgba(255,255,255,0.9)',
        fontSize: albumArt ? 28 : 32,
        textShadow: '1px 1px 4px rgba(0,0,0,0.8)',
        transform: `translateY(${40 * (1 - slideUp)}px)`,
        opacity: slideUp
      }}>
        {artistName}
      </div>

      {/* Genre and Mood badges */}
      <div style={{
        position: 'absolute',
        top: albumArt ? '72%' : '48%',
        left: 40,
        right: 40,
        display: 'flex',
        justifyContent: 'center',
        gap: 10,
        transform: `translateY(${40 * (1 - fadeIn)}px)`,
        opacity: fadeIn
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '8px 16px',
          borderRadius: 20,
          color: 'white',
          fontSize: 14,
          fontWeight: 'bold',
          backdropFilter: 'blur(10px)'
        }}>
          {genre}
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          padding: '8px 16px',
          borderRadius: 20,
          color: 'white',
          fontSize: 14,
          fontWeight: 'bold',
          backdropFilter: 'blur(10px)'
        }}>
          {mood}
        </div>
      </div>

      {/* Description */}
      {description && (
        <div style={{
          position: 'absolute',
          bottom: '25%',
          left: 40,
          right: 40,
          textAlign: 'center',
          color: 'rgba(255,255,255,0.8)',
          fontSize: 16,
          lineHeight: 1.4,
          transform: `translateY(${40 * (1 - fadeIn)}px)`,
          opacity: fadeIn
        }}>
          {description}
        </div>
      )}

      {/* Call to Action */}
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: 40,
        right: 40,
        display: 'flex',
        justifyContent: 'center',
        transform: `translateY(${40 * (1 - fadeIn)}px)`,
        opacity: fadeIn
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.9)',
          padding: '12px 32px',
          borderRadius: 25,
          color: '#333',
          fontSize: 18,
          fontWeight: 'bold',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
        }}>
          {callToAction}
        </div>
      </div>

      {/* Music note animations */}
      <MusicNotes progress={progress} />
    </AbsoluteFill>
  );
};

const BackgroundElements: React.FC<{
  mood: string;
  progress: number;
}> = ({ mood, progress }) => {
  const elements = Array.from({ length: 8 }, (_, i) => {
    const delay = i * 0.1;
    const size = 20 + Math.sin(progress * Math.PI * 2 + delay) * 15;
    const x = 20 + (i * 10) + Math.sin(progress * 2 + delay) * 5;
    const y = 20 + (i * 8) + Math.cos(progress * 1.5 + delay) * 8;
    
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
          background: `rgba(255,255,255,${0.1 + Math.sin(progress * Math.PI + delay) * 0.1})`,
          filter: 'blur(3px)',
          transform: `scale(${1 + Math.sin(progress * 3 + delay) * 0.3})`
        }}
      />
    );
  });

  return <>{elements}</>;
};

const MusicNotes: React.FC<{ progress: number }> = ({ progress }) => {
  const notes = ['♪', '♫', '♬', '♩'];
  
  return (
    <>
      {notes.map((note, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${10 + i * 25}%`,
            top: `${80 - (progress * 100 + i * 20) % 120}%`,
            fontSize: 24 + Math.sin(progress * Math.PI * 2 + i) * 8,
            color: 'rgba(255,255,255,0.6)',
            transform: `rotate(${Math.sin(progress * 2 + i) * 20}deg)`,
            opacity: 0.6 + Math.sin(progress * Math.PI + i) * 0.3
          }}
        >
          {note}
        </div>
      ))}
    </>
  );
};