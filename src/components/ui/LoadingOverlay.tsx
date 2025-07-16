import React from 'react';

export default function LoadingOverlay() {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="flex flex-col items-center">
                <div className="w-16 h-16 relative">
                    <div className="absolute inset-0 border-4 border-primary border-opacity-20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-t-primary border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-white text-lg">Loading...</p>
            </div>
        </div>
    );
}
