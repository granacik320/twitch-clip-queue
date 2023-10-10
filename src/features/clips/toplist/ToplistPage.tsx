import {Avatar, Container, Table, Text} from '@mantine/core';
 import { useSelector } from 'react-redux';
 import { selectUsers } from './toplistSlice';
 // import { getToken } from '../../auth/twitchAuthApi'

 // getUserInfoByName(user.name, useSelector(getToken)).then(function (res) {
 //
 // })

 function MemoryPage() {
     const users = useSelector(selectUsers);
     // const token = useSelector(getToken);
     console.log(users)
     return (
         <Container size="xl" py="md" m="auto">
             {users.length < 0 ? (
                 <Text style={{textAlign: "center"}}>Tu w przyszłości pojawią się najbardziej aktywni widzownie, lecz nie zwlekaj inforacje odnośnie toplist ciągle są zbierane!</Text>
             ) : (
                 <Table horizontalSpacing="sm" verticalSpacing="sm" fontSize="md">
                     <thead>
                     <tr>
                         <th></th>
                         <th>Nazwa</th>
                         <th>Punkty</th>
                     </tr>
                     </thead>
                     <tbody>{
                         users.map((user:any, index:number) => (
                             <tr key={user.name}>
                                 <td><Avatar radius="lg" color="indigo" src={null} alt="user"/></td>
                                 <td>{user.name}</td>
                                 <td>{user.points}</td>
                             </tr>
                         ))
                     }</tbody>
                 </Table>
             )}
         </Container>
     );
 }

 export default MemoryPage;

