import { useState } from 'react';
import Header from './Header';
import LoadingOverlay from '../ui/LoadingOverlay';
import { useAppSelector } from '../../app/hooks';
import { selectAuthState } from '../../features/auth/authSlice';

export default function AppLayout({ children, noNav = false }) {
    const authState = useAppSelector(selectAuthState);
    const isLoading = authState === 'authenticating';

    return (
        <div className="min-h-screen bg-background text-text-primary flex flex-col">
            <Header noNav={noNav} />

            <main className="flex-1 relative overflow-auto">
                {children}

                {isLoading && <LoadingOverlay />}
            </main>
        </div>
    );
}
