import { Group, Text } from '@mantine/core';
import { BrandGithub } from 'tabler-icons-react';
import BrandButton from './BrandButton';

function MyCredits() {
  return (
    <Text color="dimmed" size="xs" weight={400}>
      <Group spacing={1}>
        <div>by</div>
        <BrandButton href="https://github.com/JakeMiki" icon={<BrandGithub size={16} />}>
          JakeMiki
        </BrandButton>
        <div>/</div>
        <BrandButton href="https://github.com/granacik320" icon={<BrandGithub size={16} />}>
          granacik___
        </BrandButton>
      </Group>
    </Text>
  );
}

export default MyCredits;
