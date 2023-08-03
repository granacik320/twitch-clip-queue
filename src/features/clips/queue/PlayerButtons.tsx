import { Group, Button, Switch } from '@mantine/core';
import { Heart, Trash, PlayerSkipForward, PlayerTrackNext } from 'tabler-icons-react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { showNotification } from '@mantine/notifications';
import {
  autoplayChanged,
  currentClipSkipped,
  selectAutoplayEnabled,
  selectClipLimit,
  selectNextId,
  selectCurrentClip,
} from '../clipQueueSlice';
import { currentClipWatched, selectCurrentId } from '../clipQueueSlice';
import { addPoints, removePoints } from '../toplist/toplistSlice';
import { useState } from 'react';

function PlayerButtons({ className }: { className?: string }) {
  const [isLove, setIsLove] = useState(false);
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
          timestamp: new Date(Date.now() + 604800000),
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
        variant="gradient"
        gradient={{ from: 'orange', to: 'red' }}
        rightIcon={<Trash />}
        onClick={() => {
          blockUser()
          dispatch(removePoints({ name: currentClip?.submitters[0] ? currentClip?.submitters[0] : "user" , points: 10 }))
          dispatch(currentClipWatched())
          showNotification({
            title: 'Wykluczenie',
            message: `Pomyślnie zabrano możliwość użytkownikowi ${currentClip?.submitters[0]} wysyłania linków na 7 dni.`,
          })
        }}
        disabled={!currentClipId}
      >
        Gówno
      </Button>
      <Button
        color="green"

        rightIcon={<Heart
          color= {isLove ? '#D41D6C' : '#fff'}
          fill= {isLove ? '#D41D6C' : '#fff'}
        />}
        onClick={() => {
          isLove ? dispatch(removePoints({ name: currentClip?.submitters[0] ? currentClip?.submitters[0] : "user" , points: 1 })) : dispatch(addPoints({ name: currentClip?.submitters[0] ? currentClip?.submitters[0] : "user" , points: 1 }))
          setIsLove(!isLove)
          showNotification({
            title: 'Polubienie',
            message: `Pomyślnie ${isLove ? 'usunięto' : 'dodano'} polubienie dla ${currentClip?.submitters[0]}, ${isLove ? ':)' : 'oby tak dalej!'}`,
            autoClose: 3000
          })
        }}
        disabled={!currentClipId}
      >
        Złoto
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
