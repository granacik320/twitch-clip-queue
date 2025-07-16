import { useState } from 'react';
import ReactPlayer from 'react-player/lazy';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    selectCurrentClip,
    currentClipWatched,
    selectNextClip,
    autoplayChanged,
    selectAutoplayEnabled
} from '../../features/clips/clipQueueSlice';
import clipProvider from '../../features/clips/providers/providers';
import {
    Play,
    SkipForward,
    Heart,
    X,
    Check
} from 'phosphor-react';

export default function Player() {
    const dispatch = useAppDispatch();
    const currentClip = useAppSelector(selectCurrentClip);
    const nextClip = useAppSelector(selectNextClip);
    const autoplayEnabled = useAppSelector(selectAutoplayEnabled);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isLiked, setIsLiked] = useState(false);

    if (!currentClip) {
        return (
            <div className="relative bg-card aspect-video rounded-md flex items-center justify-center">
                <div className="text-center">
                    <p className="text-text-secondary mb-2">No clip selected</p>
                    {nextClip && (
                        <button
                            className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2"
                            onClick={() => dispatch(currentClipWatched())}
                        >
                            <Play size={20} />
                            <span>Play next clip</span>
                        </button>
                    )}
                </div>
            </div>
        );
    }

    const handleEnded = () => {
        if (autoplayEnabled && nextClip) {
            dispatch(currentClipWatched());
        } else {
            setIsPlaying(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Video Player */}
            <div className="relative bg-black aspect-video rounded-md overflow-hidden">
                <ReactPlayer
                    url={clipProvider.getEmbedUrl(currentClip.id)}
                    width="100%"
                    height="100%"
                    playing={isPlaying}
                    controls
                    onEnded={handleEnded}
                />
            </div>

            {/* Title and metadata */}
            <div className="space-y-2">
                <h1 className="text-xl font-bold text-white">{currentClip.title}</h1>
                <div className="flex items-center gap-4 text-text-secondary">
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-white">{currentClip.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <span>{currentClip.viewCount || '120K'} views</span>
                    </div>
                    {currentClip.createdAt && (
                        <span>{formatDate(currentClip.createdAt)}</span>
                    )}
                </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Toggle
                        label="Autoplay"
                        checked={autoplayEnabled}
                        onChange={() => dispatch(autoplayChanged(!autoplayEnabled))}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <ActionButton
                        onClick={() => {
                            // Handle dislike functionality
                        }}
                        variant="danger"
                        icon={<X size={20} />}
                        label="Bad clip"
                    />

                    <ActionButton
                        onClick={() => {
                            setIsLiked(!isLiked);
                            // Handle like functionality
                        }}
                        variant={isLiked ? "liked" : "success"}
                        icon={<Heart size={20} weight={isLiked ? "fill" : "regular"} />}
                        label="Great clip"
                    />

                    <ActionButton
                        onClick={() => dispatch(currentClipWatched())}
                        variant="primary"
                        icon={<SkipForward size={20} />}
                        label="Next clip"
                        disabled={!nextClip}
                    />
                </div>
            </div>
        </div>
    );
}

function ActionButton({ onClick, icon, label, variant = "primary", disabled = false }) {
    // Determine styles based on variant
    const baseClasses = "flex items-center gap-2 px-4 py-2 rounded-md transition-colors font-medium";

    const variantClasses = {
        primary: "bg-primary text-white hover:bg-primary/90",
        secondary: "bg-secondary text-white hover:bg-secondary/90",
        danger: "bg-danger text-white hover:bg-danger/90",
        success: "bg-success text-white hover:bg-success/90",
        liked: "bg-red-500 text-white hover:bg-red-600"
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

    return (
        <button
            className={classes}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}

function Toggle({ label, checked, onChange }) {
    return (
        <label className="flex items-center cursor-pointer">
            <div className="relative">
                <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={onChange}
                />
                <div className={`block w-10 h-6 rounded-full ${checked ? 'bg-primary' : 'bg-secondary'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'transform translate-x-4' : ''}`}></div>
            </div>
            <span className="ml-2 text-sm text-text-secondary">{label}</span>
        </label>
    );
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays < 1) {
        return 'Today';
    } else if (diffInDays === 1) {
        return 'Yesterday';
    } else if (diffInDays < 30) {
        return `${diffInDays} days ago`;
    } else if (diffInDays < 365) {
        const months = Math.floor(diffInDays / 30);
        return `${months} ${months === 1 ? 'month' : 'months'} ago`;
    } else {
        const years = Math.floor(diffInDays / 365);
        return `${years} ${years === 1 ? 'year' : 'years'} ago`;
    }
}
