import { usePeer } from '@/hooks/use-peer';
import { randomId } from '@/utils/id-generator';
import Head from 'next/head'
import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react'

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
          <Default />
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

export type Lobby = {
  id: string;
  myId: string;
  amHost: boolean;
};

export function Default() {
  //Get route
  const router = useRouter();
  const { id } = router.query;

  //Lobby state
  const [lobby, setLobby] = useState<Lobby | null>(null)

  //Handle routing to game
  useEffect(() => {
    if (id && id !== '') {
      handleJoinLobby(id as string);
    }
  }, [id])

  function handleJoinLobby(id: string) {
    setLobby({ id, myId: randomId(), amHost: false });
  }

  function handleNewLobby() {
    // const id = randomId();
    const id = "123456";
    setLobby({ id, myId: id, amHost: true });
  }

  if (!lobby)
    return <Home onNewLobby={handleNewLobby} />
  else
    return <Lobby lobby={lobby} />

  return <Game />
}

type HomeProps = {
  onNewLobby: () => void;
}

export function Home({ onNewLobby }: HomeProps) {
  return (
    <>
      <Head>
        <title>Lifeforce</title>
      </Head>
      <div className='home'>
        <div>lifeforce</div>
        <button onClick={onNewLobby}>new lobby</button>
      </div>
    </>
  )
}

type LobbyProps = {
  lobby: Lobby;
}

export function Lobby({ lobby }: LobbyProps) {
  const { myPeer } = usePeer(lobby.id);

  useEffect(() => {
    if (myPeer) {

    }
  }, [myPeer])

  if (!myPeer)
    return (
      <>
        <Head>
          <title>Lifeforce | connecting...</title>
        </Head>
        <div>
          connecting...
        </div>
      </>
    );

  return (
    <>
      <Head>
        <title>{`Lifeforce | Lobby ${lobby.id}`}</title>
      </Head>
      <div>
        <div>amHost: {lobby.amHost.toString()}</div>
        <div>lobbyId: {lobby.id}</div>
        <div>myId: {lobby.myId}</div>
        <input type='text' value={`http://localhost:3000/?id=${lobby.id}`} onChange={()=>{}} />
        <button>start game</button>
      </div>
    </>
  )
}


export function Game() {
  return (
    <>
      <div>

      </div>
    </>
  )
}
