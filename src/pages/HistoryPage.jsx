import {useAppDispatch, useAppSelector} from "../app/hooks";
import {useState} from "react";
import {memoryClipRemoved, selectClipHistoryIdsPage} from "../features/clips/clipQueueSlice";
import AppLayout from "../components/layout/AppLayout";
import ClipCard from "../components/clips/ClipCard";
import Button from "../components/ui/Button";
import {ArrowLeft, ArrowRight} from "phosphor-react";
import clipProvider from "../features/clips/providers/providers";


export default function HistoryPage() {
    const dispatch = useAppDispatch();
    const [activePage, setPage] = useState(1);
    const { clips, totalPages } = useAppSelector((state) => selectClipHistoryIdsPage(state, activePage, 24));

    return (
        <AppLayout>
            <div className="max-w-7xl mx-auto py-6 px-4">
                <h1 className="text-2xl font-bold text-white mb-6">Clip History</h1>

                {totalPages > 0 ? (
                    <>
                        <div className="flex justify-center mb-6">
                            <Pagination
                                currentPage={activePage}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            {clips.map((id) => (
                                <a
                                    key={id}
                                    href={clipProvider.getUrl(id)}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="block"
                                >
                                    <ClipCard
                                        clipId={id}
                                        onCrossClick={(e) => {
                                            e.preventDefault();
                                            dispatch(memoryClipRemoved(id));
                                        }}
                                    />
                                </a>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="bg-card rounded-lg p-8 text-center">
                        <p className="text-text-secondary text-lg">Clip history is empty.</p>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}

function Pagination({ currentPage, totalPages, onPageChange }) {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return (
        <div className="flex items-center gap-2">
            <Button
                variant="secondary"
                size="sm"
                onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                leftIcon={<ArrowLeft size={16} />}
            >
                Previous
            </Button>

            {startPage > 1 && (
                <>
                    <PageButton
                        page={1}
                        isActive={currentPage === 1}
                        onClick={() => onPageChange(1)}
                    />
                    {startPage > 2 && <span className="text-text-secondary">...</span>}
                </>
            )}

            {pages.map((page) => (
                <PageButton
                    key={page}
                    page={page}
                    isActive={currentPage === page}
                    onClick={() => onPageChange(page)}
                />
            ))}

            {endPage < totalPages && (
                <>
                    {endPage < totalPages - 1 && <span className="text-text-secondary">...</span>}
                    <PageButton
                        page={totalPages}
                        isActive={currentPage === totalPages}
                        onClick={() => onPageChange(totalPages)}
                    />
                </>
            )}

            <Button
                variant="secondary"
                size="sm"
                onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                rightIcon={<ArrowRight size={16} />}
            >
                Next
            </Button>
        </div>
    );
}

function PageButton({ page, isActive, onClick }) {
    return (
        <button
            className={`
        w-8 h-8 flex items-center justify-center rounded-md text-sm
        ${isActive
                ? 'bg-primary text-white'
                : 'bg-secondary text-text-secondary hover:text-white'}
      `}
            onClick={onClick}
        >
            {page}
        </button>
    );
}
