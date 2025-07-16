import { X } from 'phosphor-react';
import { useAppSelector } from '../../app/hooks';
import { selectClipById } from '../../features/clips/clipQueueSlice';
import { selectDisabledCategory } from '../../features/settings/settingsSlice';

export default function ClipCard({
                                     clipId,
                                     onClick,
                                     onCrossClick,
                                     isActive = false
                                 }) {
    const clip = useAppSelector(selectClipById(clipId));
    const disabledCategory = useAppSelector(selectDisabledCategory);

    if (!clip) return null;

    const { title, thumbnailUrl, author, submitters, category } = clip;
    const isCategoryDisabled = disabledCategory?.includes(category);

    const handleClick = (e) => {
        if (onClick) onClick(e);
    };

    const handleRemove = (e) => {
        e.stopPropagation();
        if (onCrossClick) onCrossClick(e);
    };

    return (
        <div
            className={`
        relative group rounded-md overflow-hidden
        p-2 transition-colors cursor-pointer
        ${isActive ? 'bg-card/80' : 'hover:bg-card/50'}
        ${isCategoryDisabled ? 'border-l-2 border-danger' : ''}
      `}
            onClick={handleClick}
        >
            <div className="flex gap-3">
                {/* Thumbnail */}
                <div className="relative h-20 w-36 flex-shrink-0">
                    <img
                        src={thumbnailUrl || '/placeholder-thumbnail.jpg'}
                        alt={title}
                        className={`w-full h-full object-cover rounded-md ${isCategoryDisabled ? 'blur-sm' : ''}`}
                    />
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 px-1 rounded text-xs text-white">
                        10:24
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-grow min-w-0">
                    <h3 className="text-sm text-white font-medium line-clamp-2">{title || 'Untitled Clip'}</h3>
                    <p className="text-xs text-text-secondary mt-1">{author || 'Unknown author'}</p>

                    {submitters?.length > 0 && (
                        <p className="text-xs text-text-secondary mt-1">
                            Submitted by <span className="font-medium">{submitters[0]}</span>
                            {submitters.length > 1 && ` +${submitters.length - 1}`}
                        </p>
                    )}

                    {category && (
                        <p className="text-xs text-text-secondary mt-1">
                            Category: <span className="font-medium">{category}</span>
                        </p>
                    )}
                </div>
            </div>

            {/* Remove button */}
            {onCrossClick && (
                <button
                    className="absolute top-2 left-2 bg-danger text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={handleRemove}
                    aria-label="Remove clip"
                >
                    <X size={12} weight="bold" />
                </button>
            )}
        </div>
    );
}
