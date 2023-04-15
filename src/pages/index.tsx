import { RoomContext, useRoom } from '@/contexts/room-context';
import { useSocket } from '@/contexts/socket-context';
import { useMe } from '@/hooks/use-me';
import { randomId } from '@/utils/id-generator';
import Head from 'next/head';
import { ReactNode, useEffect, useState } from 'react';

export type Room = {
  id: string,
  users: User[],
}

export type User = {
  id: string,
  isHost: boolean,
  color: string,
  name: string,
  life: number,
}

export type SocketError = {
  code: number;
  message: string;
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
  const { socket } = useSocket();
  const [room, setRoom] = useState<Room | null>(null);

  function handleNewRoom() {
    if (socket) {
      //Start room with randomId
      const roomId = randomId();
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

  if (!socket && !room) return <div>{`Initalizing...`}</div>
  else if (socket && !room) return <Home onNewRoom={handleNewRoom} onJoinRoom={handleJoinRoom} />
  else if (room) return (
    <RoomContext.Provider value={{ room, setRoom }}>
      <Room />
    </RoomContext.Provider>
  )
  else return <div>{`Something went wrong.`}</div>
}

type HomeProps = {
  onNewRoom: () => void;
  onJoinRoom: (roomId: string) => void;
}

export function Home({ onNewRoom, onJoinRoom }: HomeProps) {
  const [roomId, setRoomId] = useState<string>('');
  return (
    <>
      <Head>
        <title>Lifeforce</title>
      </Head>
      <div className='home'>
        <button onClick={onNewRoom}>{`new room`}</button>
        <input value={roomId} onChange={(e: any) => setRoomId(e.target.value)} />
        <button onClick={() => onJoinRoom(roomId)}>{`join room`}</button>
      </div>
    </>
  )
}


export function Room() {
  const { room, setRoom } = useRoom();
  const { me } = useMe();

  //TODO move to hook like useRoomEvents
  const { socket } = useSocket();
  useEffect(() => {
    if (socket) {
      socket.on('joined_room', (room: Room, user: User) => {
        setRoom(room);
      });
      socket.on('left_room', (room: Room, user: User) => {
        setRoom(room);
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

  }

  return (
    <>
      <Head>
        <title>Lifeforce | Room</title>
      </Head>
      <div>
        <h2>Room: {room.id}</h2>
        <UserList />
        <button onClick={handleLeaveRoom}>leave</button>
        <button disabled={!me?.isHost} onClick={handleStartGame}>start game</button>
      </div>
    </>
  )
}

export function UserList() {
  const { room, setRoom } = useRoom();
  const { me } = useMe();
  return (
    <>
      <div>
        {
          room.users.map((user: User) => {
            const isMe = user === me;
            return (
              <>
                <div key={user.id}>
                  <p>{isMe ? `(me)` : ''}{user.name}</p>
                </div>
              </>
            );
          })
        }
      </div>
    </>
  )
}

