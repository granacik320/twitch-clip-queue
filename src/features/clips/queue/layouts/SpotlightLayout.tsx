import { Container, Grid, Group } from '@mantine/core';
import Player from '../Player';
import PlayerButtons from '../PlayerButtons';
import PlayerTitle from '../PlayerTitle';
import Queue from '../Queue';
import QueueControlPanel from '../QueueControlPanel';
import React from 'react';
import DropzoneModal from "./DropzoneModal";

interface LoveProps {
  isLove: boolean;
  setIsLove: React.Dispatch<React.SetStateAction<boolean>>;
  openUploadModal: boolean;
  setOpenUploadModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const SpotlightLayout: React.FC<LoveProps> = ({isLove, setIsLove, openUploadModal, setOpenUploadModal}) => {
  return (
    <Container fluid pt="md">
        <DropzoneModal openUploadModal={openUploadModal} setOpenUploadModal={setOpenUploadModal}></DropzoneModal>
      <Container size="md">
        <Player />
        <Group position="apart" pt="xs">
          <PlayerTitle />
          <PlayerButtons isLove={isLove} setIsLove={setIsLove}/>
        </Group>
      </Container>
      <Container size="xl">
        <QueueControlPanel openUploadModal={openUploadModal} setOpenUploadModal={setOpenUploadModal}/>
        <Grid pt="sm">
          <Queue isLove={isLove} setIsLove={setIsLove} card wrapper={({ children }) => <Grid.Col span={2}>{children}</Grid.Col>} />
        </Grid>
      </Container>
    </Container>
  );
}

export default SpotlightLayout;
