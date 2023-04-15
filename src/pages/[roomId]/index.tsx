import Head from "next/head";
import { Layout } from "..";
import { useRouter } from "next/router";

export default function Room() {
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
    const router = useRouter();
    const { roomId } = router.query;

    return (
        <>
            <div>
                {roomId}
            </div>
        </>
    )
}

export type Lobby = {
    id: string;
    myId: string;
    amHost: boolean;
};

type LobbyProps = {
    lobby: Lobby;
}

export function Lobby({ lobby }: LobbyProps) {
    if (true)
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
                <input type='text' value={`http://localhost:3000/?id=${lobby.id}`} onChange={() => { }} />
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
  