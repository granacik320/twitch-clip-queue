import { Container, Text } from '@mantine/core';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { selectClipHistoryIdsPage } from '../clipQueueSlice';

function MemoryPage() {
  const dispatch = useAppDispatch();
  const [activePage, setPage] = useState(1);
  const { clips, totalPages } = useAppSelector((state) => selectClipHistoryIdsPage(state, activePage, 24));

  return (
    <Container size="xl" py="md">
      {(
        <Text>Tu w przyszłości pojawią się najbardziej aktywni widzownie, lecz nie zwlekaj inforacje odnośnie toplist ciągle są zbierane!</Text>
      )}
    </Container>
  );
}

export default MemoryPage;
