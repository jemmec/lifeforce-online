import { useSocket } from "@/contexts/socket-context"
import { RoomErrorType } from "@/types";
import { useEffect, useState } from "react";

export function RoomError() {
    const { socket } = useSocket();
    const [error, setError] = useState<RoomErrorType | null>(null);
    
    useEffect(() => {
        if (socket) {
            socket.on("room_error",
                (re: RoomErrorType) => {
                    setError(re);
                }
            );
        }
    }, [socket])
    
    if (!error) return <></>;
    return (
        <>
            <div className="room-error shadow-md">
                <div className='message'>{error.message}</div>
                <div className='debug'>
                    <p>{`Error Code: ${error.code} Room ID: ${error.roomId}`}</p>
                </div>
            </div>
            <style jsx>
                {`
                .room-error{
                    background-color: black;
                    border-radius: var(--border-radius);
                    height: 100vh;
                    width: 100vw;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .message{
                    text-align: center;
                    font-size: 32px;
                }
                .debug{
                    text-align: center;
                    font-size: 12px;
                    opacity: 0.5;
                }
                `}
            </style>
        </>
    )
}