import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import storage from 'redux-persist-indexeddb-storage';
import { persistReducer } from 'redux-persist';
import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../../app/store';
import axios from "axios";
const orderBy = require('lodash.orderby');
const TWITCH_CLIENT_ID = process.env.REACT_APP_TWITCH_CLIENT_ID;

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

export const getUserInfoByName = async (username:string, token?:string): Promise<{ data: []; status: number }> => {
  const { data, status } = await axios.get(`https://api.twitch.tv/helix/users?display_name=${username}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Client-Id': TWITCH_CLIENT_ID,
    },
  });
  return { data, status };
};

export const selectUsers = createSelector(
    (state: RootState) => state.toplist.users,
    (users) => orderBy(users, ['points'], ['desc']).slice(0,3)
);

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
