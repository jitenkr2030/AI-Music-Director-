import React from 'react';
import { Composition } from 'remotion';
import { MusicVideo } from './MusicVideo';
import { LyricVideo } from './LyricVideo';
import { Visualizer } from './Visualizer';
import { PromoVideo } from './PromoVideo';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			<Composition
				id="MusicVideo"
				component={MusicVideo}
				durationInFrames={30 * 30} // 30 seconds at 30fps
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="LyricVideo"
				component={LyricVideo}
				durationInFrames={30 * 30}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="Visualizer"
				component={Visualizer}
				durationInFrames={30 * 30}
				fps={30}
				width={1920}
				height={1080}
			/>
			<Composition
				id="PromoVideo"
				component={PromoVideo}
				durationInFrames={15 * 30} // 15 seconds
				fps={30}
				width={1080}
				height={1920} // Vertical for social media
			/>
		</>
	);
};