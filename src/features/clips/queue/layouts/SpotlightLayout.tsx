import { Container, Grid, Group } from '@mantine/core';
import Player from '../Player';
import PlayerButtons from '../PlayerButtons';
import PlayerTitle from '../PlayerTitle';
import Queue from '../Queue';
import QueueControlPanel from '../QueueControlPanel';
import React from 'react';

interface LoveProps {
  isLove: boolean;
  setIsLove: React.Dispatch<React.SetStateAction<boolean>>;
}

const SpotlightLayout: React.FC<LoveProps> = ({isLove, setIsLove}) => {
  return (
    <Container fluid pt="md">
      <Container size="md">
        <Player />
        <Group position="apart" pt="xs">
          <PlayerTitle />
          <PlayerButtons isLove={isLove} setIsLove={setIsLove}/>
        </Group>
      </Container>
      <Container size="xl">
        <QueueControlPanel />
        <Grid pt="sm">
          <Queue isLove={isLove} setIsLove={setIsLove} card wrapper={({ children }) => <Grid.Col span={2}>{children}</Grid.Col>} />
        </Grid>
      </Container>
    </Container>
  );
}

export default SpotlightLayout;
