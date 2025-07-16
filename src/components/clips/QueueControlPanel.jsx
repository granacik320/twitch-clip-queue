// import {Group, Text, SegmentedControl, Stack, ActionIcon} from '@mantine/core';
// import { useAppDispatch, useAppSelector } from '../../../app/hooks';
// import {
//   isOpenChanged,
//   selectClipLimit,
//   selectIsOpen,
//   selectQueueIds,
//   selectTotalQueueLength,
// } from '../clipQueueSlice';
// import QueueQuickMenu from './QueueQuickMenu';
// import {PlaylistAdd} from "tabler-icons-react";
// import React from "react";
//
// interface QueueControlPanelProps {
//   className?: string;
//   openUploadModal: boolean;
//   setOpenUploadModal: React.Dispatch<React.SetStateAction<boolean>>;
// }
// const QueueControlPanel: React.FC<QueueControlPanelProps> = ({className, openUploadModal, setOpenUploadModal}) => {
//   const dispatch = useAppDispatch();
//   const isOpen = useAppSelector(selectIsOpen);
//   const clipLimit = useAppSelector(selectClipLimit);
//   const totalClips = useAppSelector(selectTotalQueueLength);
//   const clipsLeft = useAppSelector(selectQueueIds).length;
//
//   return (
//     <Stack spacing={0} className={className}>
//       <Group>
//         <Text size="lg" weight={700} sx={{ flexGrow: 1 }}>
//           Queue
//         </Text>
//         <SegmentedControl
//           size="xs"
//           sx={{ flexBasis: 196 }}
//           value={isOpen ? 'open' : 'closed'}
//           data={[
//             { label: 'Closed', value: 'closed' },
//             { label: 'Open', value: 'open' },
//           ]}
//           onChange={(state) => dispatch(isOpenChanged(state === 'open'))}
//         />
//       </Group>
//       <Group>
//         <ActionIcon color='indigo' onClick={() => setOpenUploadModal(true)}>
//           <PlaylistAdd size={28}/>
//         </ActionIcon>
//         <Text size="md" weight={700} mt={0} pt={0}>
//           {clipsLeft} of {totalClips}
//           {clipLimit && `/${clipLimit}`} clips left
//         </Text>
//         <QueueQuickMenu />
//       </Group>
//     </Stack>
//   );
// }
// export default QueueControlPanel;
