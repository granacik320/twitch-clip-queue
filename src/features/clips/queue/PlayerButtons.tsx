import { Group, Button, Switch } from '@mantine/core';
import { Trash, PlayerSkipForward, PlayerTrackNext } from 'tabler-icons-react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  autoplayChanged,
  currentClipSkipped,
  selectAutoplayEnabled,
  selectClipLimit,
  selectNextId,
  selectCurrentClip,
} from '../clipQueueSlice';
import { currentClipWatched, selectCurrentId } from '../clipQueueSlice';

function PlayerButtons({ className }: { className?: string }) {
  const dispatch = useAppDispatch();
  const currentClipId = useAppSelector(selectCurrentId);
  const nextClipId = useAppSelector(selectNextId);
  const clipLimit = useAppSelector(selectClipLimit);
  const autoplayEnabled = useAppSelector(selectAutoplayEnabled);
  const currentClip = useAppSelector(selectCurrentClip);

  const blockUser = () => {
    const open: IDBOpenDBRequest = indexedDB.open("twitch-clip-queue-banlist");

    open.onsuccess = function (event: Event) {
      const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
      const tx: IDBTransaction = db.transaction("banlist", "readwrite");
      const store: IDBObjectStore = tx.objectStore("banlist");
      store.index("timestamp");

      store.put(
        {
          timestamp: new Date(Date.now() + 86400000),
        },
        currentClip?.submitters[0]
      );
    };
  }

  return (
    <Group align="flex-start" className={className}>
      <Group>
        <Switch
          label="Autoplay"
          checked={autoplayEnabled}
          onChange={(event) => dispatch(autoplayChanged(event.currentTarget.checked))}
        />
        {clipLimit && (
          <Button
            variant="default"
            rightIcon={<PlayerSkipForward />}
            onClick={() => dispatch(currentClipSkipped())}
            disabled={!currentClipId}
          >
            Skip
          </Button>
        )}
      </Group>
      <Button
        color="red"
        rightIcon={<Trash />}
        onClick={() => blockUser()}
        disabled={!currentClipId}
      >
        Gówno
      </Button>
      <Button
        rightIcon={<PlayerTrackNext />}
        onClick={() => dispatch(currentClipWatched())}
        disabled={!currentClipId && !nextClipId}
      >
        Next
      </Button>
    </Group>
  );
}

export default PlayerButtons;
