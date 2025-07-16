import { useEffect } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectUsername, selectAuthState } from '../../features/auth/authSlice';
import { useModals } from '@mantine/modals';
import ChangelogModal from './ChangelogModal';

export default function ChangelogModalTrigger() {
  const username = useAppSelector(selectUsername);
  const authState = useAppSelector(selectAuthState);
  const modals = useModals();

  useEffect(() => {
    if (username === 'xth0rek' && authState === 'authenticated') {
      const changelogKey = 'changelog_shown_v1';
      if (!localStorage.getItem(changelogKey)) {
        const id = modals.openModal({
          title: 'Lista zmian',
          children: <ChangelogModal opened={true} onClose={() => modals.closeModal(id)} />,
          closeOnClickOutside: false,
          closeOnEscape: false,
        });
        localStorage.setItem(changelogKey, '1');
      }
    }
  }, [username, authState, modals]);

  return null;
} 