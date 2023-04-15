import Head from "next/head";
import { useRouter } from "next/router"
import { Layout } from "..";

export default function Join() {
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
    const { room } = router.query;

    if (!room)
        return <div>Room not found.</div>


    return (
        <>
            <div>
                Joining room {room} ...
            </div>
        </>
    )
}