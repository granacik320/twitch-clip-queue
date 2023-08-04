import { Anchor, Center, Container, Grid, Pagination, Text } from '@mantine/core';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import Clip from '../Clip';
import { memoryClipRemoved, selectClipHistoryIdsPage } from '../clipQueueSlice';
import clipProvider from '../providers/providers';

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
