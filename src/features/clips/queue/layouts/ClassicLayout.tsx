import {Container, Grid, Group, Stack, ScrollArea, Modal, useMantineTheme, MantineTheme, Text} from '@mantine/core';
import Player from '../Player';
import PlayerButtons from '../PlayerButtons';
import PlayerTitle from '../PlayerTitle';
import Queue from '../Queue';
import QueueControlPanel from '../QueueControlPanel';
import React from 'react';
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from "react-confetti";
import {Dropzone, DropzoneStatus, MS_EXCEL_MIME_TYPE} from "@mantine/dropzone";
import {Upload, FileSpreadsheet, X, Icon as TablerIcon} from 'tabler-icons-react';
import * as xlsx from 'xlsx';
import {clipDetailsFailed, clipDetailsReceived, clipStubReceived} from "../../clipQueueSlice";
import {formatISO} from "date-fns";
import clipProvider from "../../providers/providers";
import {useAppDispatch} from "../../../../app/hooks";
import {createLogger} from "../../../../common/logging";

interface LoveProps {
  isLove: boolean;
  setIsLove: React.Dispatch<React.SetStateAction<boolean>>;
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
        // return <X {...props} />;
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
const ClassicLayout: React.FC<LoveProps> = ({isLove, setIsLove, openUploadModal, setOpenUploadModal}) => {
  const { width, height } = useWindowSize()
  const dispatch = useAppDispatch();
  const theme = useMantineTheme();
  const logger = createLogger('ClasicLayout');

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
    <Container fluid py="md" sx={{ height: '100%' }}>
      {isLove && (
          <Confetti
              width={width}
              height={height}
              numberOfPieces={200}
              recycle={false}
          />
      )}
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
      <Grid sx={{ height: '100%' }} columns={24}>
        <Grid.Col xs={14} sm={15} md={15} lg={17} xl={19} span={19}>
          <Stack justify="flex-start" spacing="xs" sx={{ height: '100%' }}>
            <Player />
            <Group position="apart">
              <PlayerTitle />
              <PlayerButtons isLove={isLove} setIsLove={setIsLove}/>
            </Group>
          </Stack>
        </Grid.Col>
        <Grid.Col xs={10} sm={9} md={9} lg={7} xl={5} span={5} sx={{ height: '100%' }}>
          <Stack justify="flex-start" sx={{ height: '100%', maxHeight: '100%' }}>
            <QueueControlPanel openUploadModal={openUploadModal} setOpenUploadModal={setOpenUploadModal}/>
            <ScrollArea sx={{ '.mantine-ScrollArea-viewport > div': { display: 'block !important' } }}>
              <Group direction="column" spacing="xs" sx={{ height: '100%' }}>
                <Queue isLove={isLove} setIsLove={setIsLove}/>
              </Group>
            </ScrollArea>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default ClassicLayout;
