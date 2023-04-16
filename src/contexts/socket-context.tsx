import { Room, User } from "@/pages";
import { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

export const SocketContext = createContext<{ socket: Socket | null }>({ socket: null });

export function useSocket() {
    return useContext(SocketContext);
}

export function SocketProvider({ children }: { children: any }) {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [error, setError] = useState<Error | null>(null);

    function cleanup() {
        if (socket) {
            //leave room
            socket.emit('leave_room');
            socket.disconnect();
        }
        setSocket(null);
    }

    useEffect(() => {
        if (!socket) {

            const s = io(process.env.NEXT_PUBLIC_SOCKET_IO_URL ?? '',
                {
                    auth: { token: process.env.NEXT_PUBLIC_SOCKET_IO_PASSPHRASE ?? '' },
                    transports: ['websocket']
                }
            );

            s.on("connect", () => {
                console.log(`Socket.io: Connected to socket with id ${s.id}`);
                setSocket(s);
            });

            s.on("connect_error", (err) => {
                console.log(`Socket.io: connect_error due to ${err.message}`);
                setError(err);
                cleanup();
            });

        }
        return (() => {
            cleanup();
        })
    }, []);

    return (
        <>
            <SocketContext.Provider value={{ socket }}>
                {children}
            </SocketContext.Provider>
        </>
    )
}