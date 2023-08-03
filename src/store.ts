import { configureStore, combineReducers, MiddlewareAPI } from '@reduxjs/toolkit';
import { persistStore, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import authReducer from '../features/auth/authSlice';
import createClipQueueMiddleware from '../features/clips/clipQueueMiddleware';
import clipQueueReducer from '../features/clips/clipQueueSlice';
import { tryMigrateLegacyData } from '../features/migration/legacyMigration';
import settingsReducer from '../features/settings/settingsSlice';
import createTwitchChatMiddleware from '../features/twitchChat/twitchChatMiddleware';
import usersSliceReducer from '../features/clips/toplist/toplistSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  settings: settingsReducer,
  clipQueue: clipQueueReducer,
  toplist: usersSliceReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(createTwitchChatMiddleware(), createClipQueueMiddleware()),
});


export const persistor = persistStore(store, undefined, () => {
  tryMigrateLegacyData(store.dispatch);
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export type AppThunkConfig = { dispatch: AppDispatch; state: RootState };
export type AppMiddlewareAPI = MiddlewareAPI<AppDispatch, RootState>;
