import { Home } from '@/components/home';
import { Room } from '@/components/room';
import { RoomContext } from '@/contexts/room-context';
import { useSocket } from '@/contexts/socket-context';
import { Layout } from '@/layouts/layout';
import { RoomType, SettingsType, UserType } from '@/types';
import { randomId } from '@/utils/id-generator';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';


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


function _() {

  //get roomId from query
  const router = useRouter();
  const { roomId } = router.query;
  //the app socket
  const { socket } = useSocket();
  //the room the user is currently in
  const [room, setRoom] = useState<RoomType | null>(null);
  //the current user inside of a room only exists when room has been defined
  const [me, setMe] = useState<UserType | null>(null);

  function handleRoomChange(newRoom: RoomType | null) {
    setRoom(newRoom);
  }

  function handleSettingsChange(settings: SettingsType) {
    if (room) {
      setRoom({ ...room, settings });
    }
  }

  function handleNewRoom() {
    if (socket) {
      //Start room with randomId
      //TODO: Move room ID generation to server (?)
      const roomId = randomId(8);
      socket.emit('new_room', roomId, (room: RoomType) => {
        setRoom(room);
      });
    }
  }

  function handleJoinRoom(roomId: string) {
    if (socket) {
      socket.emit('join_room', roomId, (room: RoomType) => {
        setRoom(room);
      });
    }
  }

  //Auto connect to roomId from url query
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

  if (!socket && !room) return <div>{`Connecting...`}</div>
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
