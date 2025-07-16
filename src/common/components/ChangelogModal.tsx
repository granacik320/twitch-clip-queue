import { Button, Stack, Text, List, Image, Divider } from '@mantine/core';

interface ChangelogModalProps {
  opened: boolean;
  onClose: () => void;
}

export default function ChangelogModal({ opened, onClose }: ChangelogModalProps) {
  return (
    <Stack>
    <Text size="md" weight={500}>Nowości w aplikacji:</Text>
    <List spacing="xs" size="sm">
      <List.Item>Dodano klipy z kicka ten tego</List.Item>
    </List>
    <Text size="xs">No i w zasadzie to tyle</Text>
    <Divider my="md" />
    <Image src="/twitch-clip-queue/2966.png"></Image>
    <Text size="md">Gratulacje wyjebałeś całe 2mb, które blokowały powtarzające się klipy 👍</Text>
    <Text size="md">PS. miałem przerabiać żeby wszystko było na serwerze + inne opcje ale nie mam czasu oh</Text>
    <Text size="xl">Siemka czacik 👋👋</Text>
    <Button mt="md" onClick={onClose}>Zamknij</Button>
  </Stack>
  );
}
