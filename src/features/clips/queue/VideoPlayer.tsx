import React from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
    src: string | undefined;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ src }) => {
    if (!src) {
        console.error('No video source provided');
        return null;
    }

    return (
        <ReactPlayer
            url={src}
            controls={true}
            playing={true}
            width="100%"
            height="100%"
            style={{ position: 'absolute', top: 0, left: 0 }}
            config={{
                file: {
                    attributes: {
                        crossOrigin: 'anonymous'
                    },
                    forceHLS: true
                }
            }}
            onError={(error) => {
                console.error('Video player error:', error);
            }}
            onReady={() => {
                console.log('Video player ready');
            }}
        />
    );
};

export default VideoPlayer;
