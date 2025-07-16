import { useState, useCallback } from 'react';
import { useAppDispatch } from '../../app/hooks';
import {
    clipStubReceived,
    clipDetailsReceived,
    clipDetailsFailed
} from '../../features/clips/clipQueueSlice';
import clipProvider from '../../features/clips/providers/providers';
import { formatISO } from 'date-fns';
import {FilePlus, UploadSimple, X} from 'phosphor-react';
import * as xlsx from 'xlsx';

export default function DropzoneModal({ openUploadModal, setOpenUploadModal }) {
    const dispatch = useAppDispatch();
    const [isDragging, setIsDragging] = useState(false);

    const handleDrop = useCallback((files) => {
        if (files?.length) {
            const file = files[0];
            const reader = new FileReader();

            reader.onload = (event) => {
                try {
                    const data = event.target.result;
                    const workbook = xlsx.read(data, { type: "array" });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const json = xlsx.utils.sheet_to_json(worksheet, { header: 0 });

                    json.forEach((row) => {
                        const id = clipProvider.getIdFromUrl(row.url);
                        if (id) {
                            dispatch(clipStubReceived({
                                id,
                                submitters: [row.nick],
                                timestamp: formatISO(new Date())
                            }));

                            clipProvider
                                .getClipById(id)
                                .then((clip) => {
                                    if (clip) {
                                        dispatch(clipDetailsReceived(clip));
                                    } else {
                                        dispatch(clipDetailsFailed(id));
                                    }
                                })
                                .catch((e) => {
                                    console.error(e);
                                    dispatch(clipDetailsFailed(id));
                                });
                        }
                    });

                    setOpenUploadModal(false);
                } catch (error) {
                    console.error('Error parsing Excel file:', error);
                    // You could add error handling UI here
                }
            };

            reader.readAsArrayBuffer(file);
        }
    }, [dispatch, setOpenUploadModal]);

    const onDragOver = useCallback((e) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const onDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const onDrop = useCallback((e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        handleDrop(files);
    }, [handleDrop]);

    const onFileInputChange = useCallback((e) => {
        const files = e.target.files;
        handleDrop(files);
    }, [handleDrop]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-surface rounded-lg max-w-xl w-full p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Upload Clip List</h2>
                    <button
                        className="p-1 hover:bg-card rounded-full"
                        onClick={() => setOpenUploadModal(false)}
                    >
                        <X size={24} className="text-text-secondary" />
                    </button>
                </div>

                <div
                    className={`
            border-2 border-dashed rounded-lg p-8
            ${isDragging ? 'border-primary bg-primary/10' : 'border-border'}
            transition-colors
          `}
                    onDragOver={onDragOver}
                    onDragLeave={onDragLeave}
                    onDrop={onDrop}
                >
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="mb-4">
                            {isDragging ? (
                                <UploadSimple size={64} className="text-primary" weight="thin" />
                            ) : (
                                <FilePlus size={64} className="text-text-secondary" weight="thin" />
                            )}
                        </div>

                        <h3 className="text-lg font-medium text-white mb-2">
                            {isDragging ? 'Drop file here' : 'Drag spreadsheet here or click to upload'}
                        </h3>

                        <p className="text-text-secondary mb-6">
                            Upload a .xlsx file with "nick" and "url" columns
                        </p>

                        <label className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors cursor-pointer">
                            <span>Select File</span>
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                className="hidden"
                                onChange={onFileInputChange}
                            />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
