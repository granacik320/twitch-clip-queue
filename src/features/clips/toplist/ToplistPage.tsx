import { Container, Text} from '@mantine/core';
import { useSelector } from 'react-redux';
import {getUserInfoByName, selectUsers} from './toplistSlice';
import { getToken } from '../../auth/twitchAuthApi'

// getUserInfoByName(user.name, useSelector(getToken)).then(function (res) {
//
// })

function MemoryPage() {
  const users = useSelector(selectUsers);
  console.log(users)
  console.log(getUserInfoByName('granacik___', useSelector(getToken)))
  return (
    <Container size="xl" py="md" m="auto">
      {users.length < 100 ? (
          <Text style={{textAlign: "center"}}>Tu w przyszłości pojawią się najbardziej aktywni widzownie, lecz nie zwlekaj inforacje odnośnie toplist ciągle są zbierane!</Text>
        ) : users.map((user:any) => (
          <Text>TU BĘDZIE PODIUM POZDRAWIAM</Text>
        ))
      }
    </Container>
  );
}

export default MemoryPage;
