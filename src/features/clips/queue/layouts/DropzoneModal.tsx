import {Group, Modal, useMantineTheme, MantineTheme, Text} from '@mantine/core';
import React from 'react';
import {Dropzone, DropzoneStatus, MS_EXCEL_MIME_TYPE} from "@mantine/dropzone";
import {Upload, FileSpreadsheet, Icon as TablerIcon} from 'tabler-icons-react';
import * as xlsx from 'xlsx';
import {clipDetailsFailed, clipDetailsReceived, clipStubReceived} from "../../clipQueueSlice";
import {formatISO} from "date-fns";
import clipProvider from "../../providers/providers";
import {useAppDispatch} from "../../../../app/hooks";
import {createLogger} from "../../../../common/logging";

interface ModalProps {
    openUploadModal: boolean;
    setOpenUploadModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
    return status.accepted
        ? theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]
        : status.rejected
            ? theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]
            : theme.colorScheme === 'dark'
                ? theme.colors.dark[0]
                : theme.colors.gray[7];
}

function ImageUploadIcon({status, ...props}: React.ComponentProps<TablerIcon> & { status: DropzoneStatus }) {
    if (status.accepted) {
        return <Upload {...props} />;
    }

    if (status.rejected) {
        return <Upload {...props} />;
    }

    return <FileSpreadsheet {...props} />;
}

export const dropzoneChildren = (status: DropzoneStatus, theme: MantineTheme) => (
    <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
        <ImageUploadIcon status={status} style={{ color: getIconColor(status, theme) }} size={80} />

        <div>
            <Text size="xl" inline>
                Przeciagnij arkusz kalkulacyjny tutaj lub nacisnij.
            </Text>
            <Text size="sm" color="dimmed" inline mt={7}>
                Dodaj plik .xlsx o odpowiedniej strukturze, 2 naglowki "nick" oraz "url"
            </Text>
        </div>
    </Group>
);
const DropzoneModal: React.FC<ModalProps> = ({openUploadModal, setOpenUploadModal}) => {
    const dispatch = useAppDispatch();
    const theme = useMantineTheme();
    const logger = createLogger('DropzoneModal');

    function handleDrop(files: File[]) {
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onload = (event:any) => {
                const data = event.target.result;
                const workbook = xlsx.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json = xlsx.utils.sheet_to_json(worksheet, { header: 0 });
                json.forEach((wers:any) => {
                    const id = clipProvider.getIdFromUrl(wers.url)
                    console.log(id, wers)
                    if(id){
                        dispatch(clipStubReceived({id , submitters: [wers.nick], timestamp: formatISO(new Date()) }))

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
                                logger.error(e);
                                dispatch(clipDetailsFailed(id));
                            });
                    }
                })
            };
            reader.readAsArrayBuffer(file);
        })
        setOpenUploadModal(false);
    }

    return (
            <Modal
                size="xl"
                opened={openUploadModal}
                onClose={() => setOpenUploadModal(false)}
                title="Przeslij liste klipow"
            >
                <Dropzone
                    onDrop={(files) => handleDrop(files)}
                    onReject={(files) => console.log('rejected files', files)}
                    multiple={false}
                    accept={MS_EXCEL_MIME_TYPE}
                >
                    {(status) => dropzoneChildren(status, theme)}
                </Dropzone>
            </Modal>
    );
}

export default DropzoneModal;
