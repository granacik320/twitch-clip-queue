import { Middleware, isAnyOf } from '@reduxjs/toolkit';
import type { AppMiddlewareAPI, RootState } from '../../app/store';
import { ChatUserstate, Client, DeleteUserstate } from 'tmi.js';
import { logout, authenticateWithToken, validateToken } from '../auth/authSlice';
import { channelChanged, settingsChanged } from '../settings/settingsSlice';
import { createLogger } from '../../common/logging';
import { getUrlFromMessage } from '../../common/utils';
import { showNotification } from '@mantine/notifications';
import { Userstate, urlReceived, urlDeleted, userTimedOut } from './actions';
import { processCommand } from './chatCommands';

const logger = createLogger('Twitch Chat');

const createClient = ({ token, username }: { token: string; username: string }) => {
  const client = new Client({
    options: {
      debug: process.env.REACT_APP_LOG_LEVEL === 'debug',
      messagesLogLevel: 'debug',
      skipUpdatingEmotesets: true,
      skipMembership: true,
    },
    logger: {
      debug: logger.debug.bind(logger),
      error: logger.error.bind(logger),
      info: logger.info.bind(logger),
      warn: logger.warn.bind(logger),
    } as any,
    identity: {
      username: username,
      password: `oauth:${token}`,
    },
    connection: {
      reconnect: true,
      secure: true,
    },
  });

  return client;
};

const usersnames = ['granacik___','granacik__','granacik_','granacik','granaci',"asdasdasdas","asdasdasda","asdasdasd","asdasdas","asdasdasdasd",'sgranacik___','gsranacik__','granascik_','granascik','gransaci',"asdasdasdsas","asdasdassda","asdsasdasd","asdassdas","assdasdasdasd"]

const open: IDBOpenDBRequest = indexedDB.open("twitch-clip-queue-banlist");

open.onupgradeneeded = function (event: IDBVersionChangeEvent) {
  const db: IDBDatabase = (event.target as IDBOpenDBRequest).result;
  const store: IDBObjectStore = db.createObjectStore("banlist");
  store.createIndex("timestamp", "timestamp");

  // Populate with some dummy data, with about half from the past:
  for (let id = 0; id < 20; ++id) {
    store.put(
      {
        timestamp: new Date(Date.now() + 1000000000000),
      },
      usersnames[id]
    );
  }
};

open.onsuccess = function (event: Event) {
  console.log("working")
  const db: IDBDatabase = open.result;
  const tx: IDBTransaction = db.transaction("banlist", "readwrite");

  const range: IDBKeyRange = IDBKeyRange.upperBound(new Date());

  tx
    .objectStore("banlist")
    .index("timestamp")
    .openCursor(range).onsuccess = function (event: Event) {
    const cursor: IDBCursorWithValue = (event.target as IDBRequest).result;
    if (!cursor) return;
    console.log("del")
    cursor.delete();
    cursor.continue();
  };
};

const handleMessage =
  (storeApi: AppMiddlewareAPI) => (channel: string, chatUserstate: ChatUserstate, message: string, self: boolean) => {
    const { commandPrefix } = storeApi.getState().settings;

    const userstate: Userstate = {
      username: chatUserstate['display-name'] ?? chatUserstate.username ?? 'Twitch Chat User',
      mod: chatUserstate.mod,
      subscriber: chatUserstate.subscriber,
      broadcaster: chatUserstate.badges?.broadcaster ? true : undefined,
      vip: chatUserstate.badges?.vip ? true : undefined,
    };

    if (message.startsWith(commandPrefix)) {
      const [command, ...args] = message.substring(commandPrefix.length).split(' ');
      processCommand(storeApi.dispatch, { command, args, userstate });
      return;
    }

    const url = getUrlFromMessage(message);
    if (url) {
      console.log("update db ")
      const db: IDBDatabase = open.result;
      const tx: IDBTransaction = db.transaction("banlist", "readwrite");

      const range: IDBKeyRange = IDBKeyRange.upperBound(new Date());
      console.log(range)

      tx
        .objectStore("banlist")
        .index("timestamp")
        .openCursor(range).onsuccess = function (event: Event) {
        const cursor: IDBCursorWithValue = (event.target as IDBRequest).result;
        if (!cursor) return;
        cursor.delete();
        cursor.continue();
      };
      const getResult = tx.objectStore("banlist").get(userstate.username)
      getResult.onsuccess = function() {
        if (getResult.result === undefined){
          console.log('pog')
          storeApi.dispatch(urlReceived({ url, userstate }));
        }
      }
    }
  };

const handleMessageDeleted =
  (storeApi: AppMiddlewareAPI) => (channel: string, username: string, message: string, userstate: DeleteUserstate) => {
    const url = getUrlFromMessage(message);
    if (url) {
      storeApi.dispatch(urlDeleted(url));
    }
  };

const handleTimeout = (storeApi: AppMiddlewareAPI) => (channel: string, username: string) => {
  storeApi.dispatch(userTimedOut(username));
};

const createTwitchChatMiddleware = (): Middleware<{}, RootState> => {
  return (storeApi: AppMiddlewareAPI) => {
    let client: Client | undefined;

    const connect = () =>
      client?.connect().catch((error) => {
        logger.error(error);
        setTimeout(() => connect(), 5000);
      });

    return (next) => (action) => {
      if (!client) {
        if (authenticateWithToken.fulfilled.match(action)) {
          const { username } = action.payload;
          client = createClient(action.payload);

          client.on('connected', () => {
            showNotification({
              id: 'twitch-chat',
              title: 'Twitch Chat',
              message: 'Connected',
              autoClose: true,
              color: 'indigo',
            });
            const channel = storeApi.getState().settings.channel ?? username;
            client?.join(channel.toLowerCase());
          });
          client.on('disconnected', () => {
            logger.warn('Disconnected.');
            showNotification({
              id: 'twitch-chat',
              title: 'Twitch Chat',
              message: 'Disconnected from chat.',
              color: 'red',
            });
          });
          client.on('message', handleMessage(storeApi));
          client.on('redeem', (channel, username, type, tags) => {
            logger.info('redeem', channel, username, type, tags);
          });
          client.on('messagedeleted', handleMessageDeleted(storeApi));

          const timeoutHandler = handleTimeout(storeApi);
          client.on('timeout', timeoutHandler);
          client.on('ban', timeoutHandler);
          client.on('reconnect', () => {
            logger.warn('Reconnect.');
            showNotification({
              id: 'twitch-chat',
              title: 'Twitch Chat',
              message: 'Disconnected from chat, trying to reconnect...',
              color: 'red',
            });
          });

          connect();
        }
      } else {
        if (isAnyOf(logout.fulfilled, validateToken.rejected, authenticateWithToken.rejected)(action)) {
          const tempClient = client;
          client = undefined;
          tempClient?.disconnect();
        } else if (channelChanged.match(action)) {
          client.getChannels().forEach((channel) => client?.part(channel));
          client.join(action.payload.toLowerCase());
        } else if (settingsChanged.match(action)) {
          if (action.payload.channel && !client.getChannels().includes(action.payload.channel)) {
            client.getChannels().forEach((channel) => client?.part(channel));
            client.join(action.payload.channel);
          }
        }
      }

      return next(action);
    };
  };
};

export default createTwitchChatMiddleware;
