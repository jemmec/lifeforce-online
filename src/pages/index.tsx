import { GameContext, useGame } from '@/contexts/game-context';
import { RoomContext, useRoom } from '@/contexts/room-context';
import { useSocket } from '@/contexts/socket-context';
import { randomId } from '@/utils/id-generator';
import Head from 'next/head';
import router, { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';

import { Yeseva_One } from 'next/font/google'
const titleFont = Yeseva_One({ subsets: ['latin'], weight: '400' })

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

export function Layout({ children }: {
  children: ReactNode;
}) {
  return (
    <>
      <div className='fullscreen'>
        <div className='app-container'>
          <h1 className={titleFont.className}>{`Lifeforce`}</h1>
          {children}
        </div>
      </div>
      <style jsx>
        {`
          h1{
            font-size: 48px;
          }
          .fullscreen{
            width: 100vw;
            height: 100vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
          }
          .app-container{
            max-width: 720px;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            gap: var(--gap-lg);
          }
        `}
      </style>
    </>
  )
}


function _() {

  //get roomId from query
  const router = useRouter();
  const { roomId } = router.query;
  //the app socket
  const { socket } = useSocket();
  //the room the user is currently in
  const [room, setRoom] = useState<Room | null>(null);
  //the current user inside of a room only exists when room has been defined
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
        <button onClick={onNewRoom}>{`New Game`}</button>
      </div>
      <SmallText />
      <style jsx>
        {`
          .home{
            padding: 12px;
          }
        `}
      </style>
    </>
  )
}

export function SmallText() {
  return (
    <>
      <div className='small-text'>
        {`Lifeforce is an open source project created by @jemmec. Sit minim cupidatat in duis esse do. Ad exercitation tempor ipsum Lorem anim excepteur elit ut nulla nostrud. Quis eu et nostrud excepteur proident nulla qui ut ullamco dolore excepteur.`}
      </div>
      <style jsx>
        {`
          .small-text{
            opacity: 0.35;
            font-size: 12px;
            text-align: center;
          }
        `}
      </style>
    </>
  )
}

export function Room() {
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
        <div className='room'>
          {me.isHost ? <RoomLink /> : <></>}
          <div className='lobby'>
            <Users />
            <Settings />
          </div>
          <div className='buttons'>
            <button onClick={handleLeaveRoom}>leave</button>
            {me.isHost ? <button onClick={handleStartGame}>start game</button> : <></>}
          </div>
        </div>
        <style jsx>
          {`
            .room{
              width: 100%;
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: center;
              gap: var(--gap-lg);
            }
            .lobby{
              display: flex;
              flex-direction: row;
              gap: 24px;
            }
            .buttons{
              display: flex;
              flex-direction: row;
              justify-content: center;
              gap: var(--gap-lg)
            }
          `}
        </style>
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
  const [copied, setCopied] = useState(false);

  function handleLinkCopy() {
    setCopied(true);
    navigator.clipboard.writeText(`http://localhost:3000/?roomId=${room.id}`);
  }

  return (
    <>
      <div className='room-link'>
        <div>{`Share the link:`}</div>
        <button className='link' onClick={handleLinkCopy}>
          {copied ? 'Copied!' : `http://localhost:3000/?roomId=${room.id}`}
        </button>
      </div>
      <style jsx>
        {`
          .room-link{
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: var(--gap-sm);
          }
          .link{
            text-decoration: underline;
          }
        `}
      </style>
    </>
  )
}

export function Settings() {

  const { socket } = useSocket();
  const { me, room, setSettings } = useRoom();

  function handleSettingsPropChange(prop: string, value: any) {
    if (socket) {
      const settings = { ...room.settings, [prop]: value };
      setSettings(settings);
      socket.emit('update_settings', room.id, settings,)
    }
  }

  return (
    <>
      <div className='settings'>
        <h2>{`Game Settings`}</h2>
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
      <style jsx>
        {`
          .settings{

          }
        `}
      </style>
    </>
  )
}

export function Users() {
  const { me, room } = useRoom();
  return (
    <>
      <div>
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