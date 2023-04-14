// @ts-nocheck
import { useEffect, useState } from "react";

//TODO: return a send and recieve function

export function usePeer(id: string) {
    const [myPeer, setMyPeer] = useState<any | null>(null);
    

    function destory() {
        if (myPeer) {
            myPeer.disconnect();
            myPeer.destroy();
        }
        setMyPeer(null);
    }

    useEffect(() => {
        import('peerjs').then(({ default: Peer }) => {
            const peer = myPeer ? myPeer : new Peer(
                id,
                {
                    host: process.env.NEXT_PUBLIC_PEER_URL ?? 'localhost',
                    port: process.env.NEXT_PUBLIC_PEER_PORT ? Number.parseInt(process.env.NEXT_PUBLIC_PEER_PORT) : 3001,
                    key: process.env.NEXT_PUBLIC_PEER_KEY ?? '',
                }
            );

            peer.on('open', (id) => {
                setMyPeer(peer);
            });

            peer.on('disconnected', () => {
                destory();
            });

            peer.on('close', () => {
                destory();
            });

            peer.on('error', (error) => {
                destory();
            });

        }).catch((err) => console.error(err));
        return (() => {
            destory();
        });
    }, [id]);

    return { myPeer };
}
