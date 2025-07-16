import { useState } from 'react';
import AppLayout from '../components/layout/AppLayout';
import Player from '../components/clips/Player';
import Queue from '../components/clips/Queue';
import DropzoneModal from '../components/clips/DropzoneModal'; // You'll need to recreate this component
import { useAppSelector } from '../app/hooks';
import { selectLayout } from '../features/clips/clipQueueSlice';

export default function ClipsPage() {
    const layout = useAppSelector(selectLayout);
    const [isLove, setIsLove] = useState(false);
    const [openUploadModal, setOpenUploadModal] = useState(false);

    return (
        <AppLayout>
            {layout === 'classic' && <ClassicLayout isLove={isLove} setIsLove={setIsLove} openUploadModal={openUploadModal} setOpenUploadModal={setOpenUploadModal} />}
            {layout === 'spotlight' && <SpotlightLayout isLove={isLove} setIsLove={setIsLove} openUploadModal={openUploadModal} setOpenUploadModal={setOpenUploadModal} />}
            {layout === 'fullscreen' && <FullscreenLayout isLove={isLove} setIsLove={setIsLove} openUploadModal={openUploadModal} setOpenUploadModal={setOpenUploadModal} />}

            {openUploadModal && (
                <DropzoneModal
                    openUploadModal={openUploadModal}
                    setOpenUploadModal={setOpenUploadModal}
                />
            )}
        </AppLayout>
    );
}

function ClassicLayout({ isLove, setIsLove, openUploadModal, setOpenUploadModal }) {
    return (
        <div className="grid grid-cols-12 gap-4 p-4 h-full">
            <div className="col-span-8 lg:col-span-9">
                <div className="space-y-4">
                    <Player />
                </div>
            </div>

            <div className="col-span-4 lg:col-span-3">
                <Queue openUploadModal={() => setOpenUploadModal(true)} />
            </div>
        </div>
    );
}

function SpotlightLayout({ isLove, setIsLove, openUploadModal, setOpenUploadModal }) {
    return (
        <div className="p-4 space-y-6">
            <div className="max-w-4xl mx-auto">
                <Player />
            </div>

            <div className="max-w-6xl mx-auto">
                <Queue openUploadModal={() => setOpenUploadModal(true)} />
            </div>
        </div>
    );
}

function FullscreenLayout({ isLove, setIsLove, openUploadModal, setOpenUploadModal }) {
    // This would implement a layout with a popup player
    // For simplicity, we'll just use the spotlight layout here
    return <SpotlightLayout isLove={isLove} setIsLove={setIsLove} openUploadModal={openUploadModal} setOpenUploadModal={setOpenUploadModal} />;
}
