import React from 'react';
import { 
  useCurrentFrame, 
  useVideoConfig, 
  AbsoluteFill, 
  interpolate,
  spring
} from 'remotion';

interface LyricVideoProps {
  songTitle: string;
  artistName: string;
  lyrics: Array<{
    text: string;
    startTime: number;
    endTime: number;
  }>;
  audioUrl: string;
  backgroundImage?: string;
  style: 'simple' | 'dynamic' | 'cinematic';
}

export const LyricVideo: React.FC<LyricVideoProps> = ({
  songTitle,
  artistName,
  lyrics,
  backgroundImage,
  style
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentTime = frame / fps;

  // Find current and next lyrics
  const currentLyricIndex = lyrics.findIndex(
    l => currentTime >= l.startTime && currentTime <= l.endTime
  );
  
  const currentLyric = currentLyricIndex >= 0 ? lyrics[currentLyricIndex] : null;
  const nextLyric = currentLyricIndex < lyrics.length - 1 ? lyrics[currentLyricIndex + 1] : null;

  // Calculate progress within current lyric
  const lyricProgress = currentLyric 
    ? (currentTime - currentLyric.startTime) / (currentLyric.endTime - currentLyric.startTime)
    : 0;

  return (
    <AbsoluteFill style={{
      background: backgroundImage 
        ? `url(${backgroundImage}) center/cover` 
        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      {/* Overlay for better text readability */}
      <AbsoluteFill style={{
        background: 'rgba(0, 0, 0, 0.4)'
      }} />

      {/* Song info */}
      <div style={{
        position: 'absolute',
        top: 50,
        left: 50,
        color: 'white',
        fontSize: 32,
        fontWeight: 'bold',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
      }}>
        {songTitle}
      </div>
      
      <div style={{
        position: 'absolute',
        top: 90,
        left: 50,
        color: 'rgba(255,255,255,0.8)',
        fontSize: 24,
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
      }}>
        {artistName}
      </div>

      {/* Main lyric display */}
      {currentLyric && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'white',
          fontSize: style === 'simple' ? 48 : style === 'dynamic' ? 64 : 72,
          fontWeight: 'bold',
          textShadow: '3px 3px 6px rgba(0,0,0,0.9)',
          maxWidth: '80%',
          opacity: interpolate(lyricProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]),
          transform: `translate(-50%, -50%) scale(${1 + Math.sin(lyricProgress * Math.PI) * 0.1})`
        }}>
          {currentLyric.text}
        </div>
      )}

      {/* Next lyric preview */}
      {nextLyric && style !== 'simple' && (
        <div style={{
          position: 'absolute',
          top: '65%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center',
          color: 'rgba(255,255,255,0.6)',
          fontSize: 36,
          textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
          maxWidth: '80%',
          opacity: interpolate(lyricProgress, [0.7, 1], [0, 1])
        }}>
          {nextLyric.text}
        </div>
      )}

      {/* Progress bar */}
      <div style={{
        position: 'absolute',
        bottom: 50,
        left: 50,
        right: 50,
        height: 8,
        background: 'rgba(255,255,255,0.3)',
        borderRadius: 4,
        overflow: 'hidden'
      }}>
        <div style={{
          height: '100%',
          width: `${(currentTime / Math.max(...lyrics.map(l => l.endTime))) * 100}%`,
          background: 'linear-gradient(90deg, #ff6b6b, #ffd93d)',
          borderRadius: 4,
          transition: 'width 0.1s ease-out'
        }} />
      </div>

      {/* Time display */}
      <div style={{
        position: 'absolute',
        bottom: 70,
        right: 50,
        color: 'white',
        fontSize: 18,
        textShadow: '1px 1px 2px rgba(0,0,0,0.8)'
      }}>
        {formatTime(currentTime)}
      </div>

      {/* Dynamic visual effects */}
      {style === 'dynamic' && <DynamicEffects currentTime={currentTime} />}
      {style === 'cinematic' && <CinematicEffects currentTime={currentTime} />}
    </AbsoluteFill>
  );
};

const DynamicEffects: React.FC<{ currentTime: number }> = ({ currentTime }) => {
  const particles = Array.from({ length: 15 }, (_, i) => (
    <div
      key={i}
      style={{
        position: 'absolute',
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        width: 4,
        height: 4,
        borderRadius: '50%',
        background: `hsl(${Math.random() * 360}, 100%, 70%)`,
        opacity: 0.6,
        transform: `translateY(${-currentTime * 50}px)`,
        animation: `twinkle ${2 + Math.random()}s ease-in-out infinite`
      }}
    />
  ));

  return <>{particles}</>;
};

const CinematicEffects: React.FC<{ currentTime: number }> = ({ currentTime }) => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `radial-gradient(circle at 50% 50%, transparent 30%, rgba(0,0,0,0.4) 100%)`,
      pointerEvents: 'none'
    }} />
  );
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};