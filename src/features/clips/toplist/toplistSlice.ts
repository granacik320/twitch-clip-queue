import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import storage from 'redux-persist-indexeddb-storage';
import { persistReducer } from 'redux-persist';

interface User {
  name: string;
  points: number;
}

interface UsersState {
  users: User[];
}

const initialState: UsersState = {
  users: [],
};


const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addPoints(state, action: PayloadAction<{ name: string; points: number }>) {
      const { name, points } = action.payload;
      const user = state.users.find((u) => u.name === name);
      if (user) {
        user.points += points;
      }else{
        state.users.push(action.payload);
      }
    },
    removePoints(state, action: PayloadAction<{ name: string; points: number }>) {
      const { name, points } = action.payload;
      const user = state.users.find((u) => u.name === name);
      if (user) {
        user.points = Math.max(0, user.points - points);
      }
    },
  },
});

export const { addPoints, removePoints } = usersSlice.actions;

const usersSliceReducer = persistReducer(
  {
    key: 'toplist',
    storage: storage('twitch-clip-queue'),
    version: 1,
    blacklist: ['isOpen'],
  },
  usersSlice.reducer
);
export default usersSliceReducer;
