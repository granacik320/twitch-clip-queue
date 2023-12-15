import {Box, Button, Center, Group, Image, Stack, Text, Title} from '@mantine/core';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import AutoplayOverlay from './AutoplayOverlay';
import {
  autoplayTimeoutHandleChanged, currentClipWatched,
  selectAutoplayEnabled,
  selectAutoplayTimeoutHandle,
  selectCurrentClip,
  selectNextId,
} from '../clipQueueSlice';
import ReactPlayer from 'react-player/lazy';
import clipProvider from '../providers/providers';
import {selectDisabledCategory} from "../../settings/settingsSlice";
import {PlayerPlay, PlayerTrackNext} from "tabler-icons-react";
import React, {useState} from "react";

interface PlayerProps {
  className?: string;
  setIsLove: React.Dispatch<React.SetStateAction<boolean>>;
}

function Player({ className, setIsLove }: PlayerProps) {
  const dispatch = useAppDispatch();
  const currentClip = useAppSelector(selectCurrentClip);
  const nextClipId = useAppSelector(selectNextId);
  const autoplayEnabled = useAppSelector(selectAutoplayEnabled);
  const autoplayTimeoutHandle = useAppSelector(selectAutoplayTimeoutHandle);
  const disabledCategory = useAppSelector(selectDisabledCategory);
  const [isWatchin, setIsWatching] = useState(false);

  let player = undefined;
  if (currentClip) {
    if (autoplayEnabled) {
      const autoplayUrl = clipProvider.getAutoplayUrl(currentClip.id, currentClip);
      if (autoplayUrl && ReactPlayer.canPlay(autoplayUrl)) {
        player = (
          <ReactPlayer
            key={currentClip.id}
            playing
            controls
            url={autoplayUrl}
            width="100%"
            height="100%"
            style={{
              maxHeight: '100%',
              maxWidth: '100%',
            }}
            onEnded={() => nextClipId && dispatch(autoplayTimeoutHandleChanged({ set: true }))}
          />
        );
      }
    }

    if (!player) {
      const embedUrl = clipProvider.getEmbedUrl(currentClip.id);
      player = (
        <iframe
          key={currentClip.id}
          src={embedUrl}
          title={currentClip.title}
          style={{
            height: '100%',
            width: '100%',
          }}
          frameBorder="0"
          allow="autoplay"
          allowFullScreen
        ></iframe>
      );
    }
  }
  return (
    <Stack
      align="center"
      sx={{ background: 'black', height: '100%', aspectRatio: '16 / 9', position: 'relative' }}
      className={className}
    >

      {disabledCategory?.includes(currentClip?.category!) && !isWatchin ? <Waring setIsWatching={setIsWatching} currentClipId={currentClip?.id} setIsLove={setIsLove}/> : player}
      <AutoplayOverlay
        visible={!!autoplayTimeoutHandle}
        onCancel={() => dispatch(autoplayTimeoutHandleChanged({ set: false }))}
      />
    </Stack>
  );
}

interface WarningProps {
  setIsLove: React.Dispatch<React.SetStateAction<boolean>>;
  currentClipId?: any;
  setIsWatching: React.Dispatch<React.SetStateAction<boolean>>;
}

const Waring = ({currentClipId, setIsLove, setIsWatching}: WarningProps) => {
  const dispatch = useAppDispatch();
  const nextClipId = useAppSelector(selectNextId);

  return (
    <Stack
        style={{
          padding: '10px 20px',
          height: '100%',
          width: '100%',
          backgroundColor:"#151419",
          border: '1px solid #2C2E33',
        }}
    >
      <Center>
        <Image height={256} width={256} src={'twitch-clip-queue/hand.jpg'}></Image>
        <Box ml={24}>
          <Title order={1}>Uwaga</Title>
          <Text size="sm">Ta kategoria jest wyłączona w ustawieniach</Text>
          <Group mt={24}>
            <Button
                variant="gradient"
                gradient={{ from: 'violet', to: 'indigo', deg: 79 }}
                rightIcon={<PlayerPlay/>}
                onClick={() => {
                    setIsWatching(true)
                }}
            >
              Zobacz
            </Button>
            <Button
                variant="light"
                rightIcon={<PlayerTrackNext />}
                onClick={() => {
                    dispatch(currentClipWatched())
                    setIsLove(false)
                }}
                disabled={!currentClipId && !nextClipId}
            >
                Pomiń
            </Button>
          </Group>
        </Box>
      </Center>
    </Stack>
  )
}

export default Player;
