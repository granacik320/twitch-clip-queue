import { useAppSelector } from '../../../app/hooks';
import { selectLayout } from '../clipQueueSlice';
import ClassicLayout from './layouts/ClassicLayout';
import FullscreenWithPopupLayout from './layouts/FullscreenWithPopupLayout';
import SpotlightLayout from './layouts/SpotlightLayout';
import { useState } from 'react';

function QueuePage() {
  const layout = useAppSelector(selectLayout);
  const [isLove, setIsLove] = useState<boolean>(false);

  switch (layout) {
    case 'classic':
      return <ClassicLayout isLove={isLove} setIsLove={setIsLove}/>;
    case 'spotlight':
      return <SpotlightLayout isLove={isLove} setIsLove={setIsLove}/>;
    case 'fullscreen':
      return <FullscreenWithPopupLayout isLove={isLove} setIsLove={setIsLove}/>;
    default:
      return <ClassicLayout isLove={isLove} setIsLove={setIsLove}/>;
  }
}

export default QueuePage;
