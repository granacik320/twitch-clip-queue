import { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    selectQueueIds,
    selectCurrentId,
    currentClipReplaced,
    queueClipRemoved,
    isOpenChanged,
    selectIsOpen,
    selectTotalQueueLength,
    selectClipLimit,
    queueCleared
} from '../../features/clips/clipQueueSlice';
import ClipCard from './ClipCard';
import {
    Plus,
    Trash,
    CaretRight,
    CaretDown,
    DotsThreeVertical,
    FolderPlus
} from 'phosphor-react';

export default function Queue({ openUploadModal }) {
    const dispatch = useAppDispatch();
    const queueIds = useAppSelector(selectQueueIds);
    const currentId = useAppSelector(selectCurrentId);
    const isOpen = useAppSelector(selectIsOpen);
    const totalClips = useAppSelector(selectTotalQueueLength);
    const clipLimit = useAppSelector(selectClipLimit);
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="bg-surface rounded-lg overflow-hidden">
            {/* Queue header */}
            <div className="px-4 py-3 bg-card flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-white">Queue</h2>
                    <span className="text-sm text-text-secondary">
            {queueIds.length} of {totalClips}{clipLimit ? `/${clipLimit}` : ''} clips
          </span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        className="p-2 rounded-full hover:bg-secondary transition-colors"
                        onClick={() => openUploadModal && openUploadModal(true)}
                        title="Upload clips"
                    >
                        <FolderPlus size={20} className="text-text-secondary" />
                    </button>

                    <QueueToggle isOpen={isOpen} onChange={(open) => dispatch(isOpenChanged(open))} />

                    <div className="relative">
                        <button
                            className="p-2 rounded-full hover:bg-secondary transition-colors"
                            onClick={() => setMenuOpen(!menuOpen)}
                            title="Queue options"
                        >
                            <DotsThreeVertical size={20} className="text-text-secondary" />
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-card rounded-md shadow-lg py-1 z-10">
                                <MenuItem
                                    icon={<Trash size={16} />}
                                    label="Clear queue"
                                    onClick={() => {
                                        dispatch(queueCleared());
                                        setMenuOpen(false);
                                    }}
                                    danger
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Queue content */}
            <div className="max-h-[calc(100vh-230px)] overflow-y-auto">
                {queueIds.length > 0 ? (
                    <div className="p-2 space-y-2">
                        {queueIds.map((id) => (
                            <ClipCard
                                key={id}
                                clipId={id}
                                isActive={id === currentId}
                                onClick={() => dispatch(currentClipReplaced(id))}
                                onCrossClick={() => dispatch(queueClipRemoved(id))}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                        <p className="text-text-secondary mb-4">Queue is empty</p>
                        {!isOpen && (
                            <button
                                className="bg-primary text-white px-4 py-2 rounded-md flex items-center gap-2"
                                onClick={() => dispatch(isOpenChanged(true))}
                            >
                                <Plus size={20} />
                                <span>Open Queue</span>
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

function QueueToggle({ isOpen, onChange }) {
    return (
        <div className="flex items-center">
            <button
                className={`
          px-3 py-1 text-sm rounded-l-md
          ${isOpen
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-text-secondary hover:bg-secondary/80'}
        `}
                onClick={() => onChange(true)}
            >
                Open
            </button>
            <button
                className={`
          px-3 py-1 text-sm rounded-r-md
          ${!isOpen
                    ? 'bg-primary text-white'
                    : 'bg-secondary text-text-secondary hover:bg-secondary/80'}
        `}
                onClick={() => onChange(false)}
            >
                Close
            </button>
        </div>
    );
}

function MenuItem({ icon, label, onClick, danger = false }) {
    return (
        <button
            className={`
        w-full flex items-center gap-2 px-4 py-2 text-sm
        hover:bg-secondary transition-colors
        ${danger ? 'text-danger hover:text-danger' : 'text-text-secondary hover:text-white'}
      `}
            onClick={onClick}
        >
            {icon}
            <span>{label}</span>
        </button>
    );
}
