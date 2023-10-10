import { Container, Grid, Group, Stack, ScrollArea } from '@mantine/core';
import Player from '../Player';
import PlayerButtons from '../PlayerButtons';
import PlayerTitle from '../PlayerTitle';
import Queue from '../Queue';
import QueueControlPanel from '../QueueControlPanel';
import React from 'react';
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from "react-confetti";

interface LoveProps {
  isLove: boolean;
  setIsLove: React.Dispatch<React.SetStateAction<boolean>>;
}

const ClassicLayout: React.FC<LoveProps> = ({isLove, setIsLove}) => {
  const { width, height } = useWindowSize()
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
            <QueueControlPanel />
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
