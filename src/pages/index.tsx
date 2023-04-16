import { GameContext, useGame } from '@/contexts/game-context';
import { RoomContext, useRoom } from '@/contexts/room-context';
import { useSocket } from '@/contexts/socket-context';
import { randomId } from '@/utils/id-generator';
import Head from 'next/head';
import router, { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';

export type Room = {
  id: string,
  users: User[],
  settings: Settings,
  gameState: GameState | null;
}

export type User = {
  id: string,
  isHost: boolean,
  color: string,
  name: string,
}

export type Settings = {
  startingLife: number,
}

export type SocketError = {
  code: number;
  message: string;
}

export type GameState = {
  playerStates: PlayerState[];
}

export type PlayerState = {
  userId: string;
  life: number;
}

export default function Index() {
  return (
    <>
      <Head>
        <meta name="description" content="Lifeforce life counter application." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Layout>
          <_ />
        </Layout>
      </main>
    </>
  )
}

type LayoutProps = {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <div className='fullscreen'>
        <div className='app-container'>
          <h2>Lifeforce</h2>
          {children}
        </div>
      </div>
      <style jsx>
        {`
          .fullscreen{
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .app-container{
            max-width: 1280px;
          }
        `}
      </style>
    </>
  )
}


function _() {
  //try to get the roomId query param
  const router = useRouter();
  const { roomId } = router.query;
  //the app socket
  const { socket } = useSocket();
  //the room the user is currently in
  const [room, setRoom] = useState<Room | null>(null);
  //the current user inside of a room
  //Only exists when room has been defined
  const [me, setMe] = useState<User | null>(null);

  function handleRoomChange(newRoom: Room | null) {
    setRoom(newRoom);
  }

  function handleSettingsChange(settings: Settings) {
    if (room) {
      setRoom({ ...room, settings });
    }
  }

  function handleNewRoom() {
    if (socket) {
      //Start room with randomId
      //TODO: Move room ID generation to server (?)
      const roomId = randomId(8);
      socket.emit('new_room', roomId, (room: Room) => {
        setRoom(room);
      });
    }
  }

  function handleJoinRoom(roomId: string) {
    if (socket) {
      socket.emit('join_room', roomId, (room: Room) => {
        setRoom(room);
      });
    }
  }

  //Auto connect to roomId
  useEffect(() => {
    if (socket && roomId) {
      handleJoinRoom(roomId as string);
      //remove the roomId for cleaner UX
      router.replace('/');
    }
  }, [socket])

  useEffect(() => {
    if (socket && room) {
      const user = room.users.find(x => x.id === socket.id);
      if (user)
        setMe(user);
    }
  }, [socket, room])

  if (!socket && !room) return <div>{`Initalizing...`}</div>
  else if (socket && !room) return <Home onNewRoom={handleNewRoom} />
  else if (room && me) return (
    <RoomContext.Provider
      value={{
        me,
        room,
        setRoom: handleRoomChange,
        setSettings: handleSettingsChange
      }}>
      <Room />
    </RoomContext.Provider>
  )
  else return <div>{`Something went wrong.`}</div>
}

type HomeProps = {
  onNewRoom: () => void;
}

export function Home({ onNewRoom }: HomeProps) {
  return (
    <>
      <Head>
        <title>{`Lifeforce`}</title>
      </Head>
      <div className='home'>
        <button onClick={onNewRoom}>{`new room`}</button>
      </div>
    </>
  )
}

export function Room() {
  //TODO move to hook like useRoomEvents

  const { me, room, setRoom, setSettings } = useRoom();
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on('updated_room', (room: Room) => {
        setRoom(room);
      });
      socket.on('updated_settings', (settings: Settings) => {
        setSettings(settings);
      });
    }
  }, [socket]);

  function handleLeaveRoom() {
    if (socket) {
      socket.emit('leave_room', room.id, () => {
        setRoom(null);
      });
    }
  }

  function handleStartGame() {
    if (socket) {
      //Star the game
      socket.emit('start_game', room.id);
    }
  }

  function handleGameStateChange(gameState: GameState) {
    //Push gamestate changes up to room
    setRoom({ ...room, gameState });
  }

  if (!room.gameState)
    return (
      <>
        <Head>
          <title>{`Lifeforce | Room`}</title>
        </Head>
        <div>
          <RoomLink />
          <Users />
          <Settings />
          <button onClick={handleLeaveRoom}>leave</button>
          {
            me.isHost ? <button onClick={handleStartGame}>start game</button> : <></>
          }
        </div>
      </>
    )

  return (
    <>
      <GameContext.Provider
        value={{
          gameState: room.gameState,
          setGameState: handleGameStateChange
        }}>
        <Game />
      </GameContext.Provider>
    </>
  )
}

export function RoomLink() {
  const { room } = useRoom();

  return (
    <>
      <div>
        <a href={`/?roomId=${room.id}`}>
          {`http://localhost:3000/?roomId=${room.id}`}
        </a>
      </div>
    </>
  )
}

export function Settings() {

  const { socket } = useSocket();
  const { me, room, setSettings } = useRoom();

  function handleSettingsPropChange(prop: string, value: any) {
    if (socket) {
      //update prop
      const settings = { ...room.settings, [prop]: value };
      //update local state
      setSettings(settings);
      //broadcast settings change to all sockets
      socket.emit('update_settings', room.id, settings,)
    }
  }

  return (
    <>
      <div>
        <div>
          <div>{`Starting life: `}</div>
          <div>{room.settings.startingLife}</div>
          <input
            type="range"
            min={1}
            max={80}
            disabled={!me.isHost}
            value={room.settings.startingLife}
            onChange={(e) => handleSettingsPropChange('startingLife', Number.parseInt(e.target.value))}
          />
        </div>
      </div>
    </>
  )
}

export function Users() {
  const { me, room } = useRoom();
  return (
    <>
      <div>
        {
          room.users.map((user: User) => {
            const isMe = user === me;
            return (
              <div key={user.id}>
                <p>{isMe ? `(me)` : ''}{user.name}</p>
              </div>
            );
          })
        }
      </div>
    </>
  )
}

export function Game() {
  const { socket } = useSocket();
  const { gameState, setGameState } = useGame();
  const { me, room } = useRoom();
  const [myState, setMyState] = useState<PlayerState | null>();

  useEffect(() => {
    const ms = gameState.playerStates.find(x => x.userId === me.id);
    if (ms)
      setMyState(ms);
  }, [me, gameState]);

  useEffect(() => {
    if (socket) {
      socket.on('updated_gamestate', (gameState: GameState) => {
        setGameState(gameState);
      });
    }
  }, [socket])

  function handleModLife(value: number) {
    if (socket && myState) {
      //update local state
      setMyState({ ...myState, life: myState.life += value });
      socket.emit('mod_life', room.id, value);
    }
  }

  function handleModOtherLife(value: number) {
    if (socket) {
      //update local state

      socket.emit('mod_other_life', room.id, value);
    }
  }

  function handleResetGame() {
    if (socket) {
      socket.emit('reset_game', room.id);
    }
  }

  function handleBackToLobby() {
    if (socket) {
      socket.emit('end_game', room.id);
    }
  }

  if (!myState) return <div>{`Game in progress...`}</div>

  return (
    <>
      <Head>
        <title>{`Lifeforce | In Game`}</title>
      </Head>
      <div>
        <div>
          {
            gameState.playerStates.map(playerState => {
              //Get user info from the room
              const user = room.users.find(x => x.id === playerState.userId);
              if (!user || user === me) return <></>;
              return (
                <>
                  <div key={playerState.userId} >
                    <div>{user.name}</div>
                    <h3>{playerState.life}</h3>
                  </div>
                </>
              );
            })
          }
        </div>
        <div>
          <button onClick={() => handleModOtherLife(-1)}>{`decrease other`}</button>
          <button onClick={() => handleModOtherLife(+1)}>{`increase other`}</button>
        </div>
        <div>
          <button onClick={() => handleModLife(-1)}>{`decrease`}</button>
          <h1>{myState.life}</h1>
          <button onClick={() => handleModLife(+1)}>{`increase`}</button>
        </div>
        {
          me.isHost ? <>
            <button onClick={handleResetGame}>{`reset`}</button>
            <button onClick={handleBackToLobby}>{`back to lobby`}</button>
          </> : <></>
        }
      </div>
    </>
  )

}