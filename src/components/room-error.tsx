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
            <div className="room-error">
                <div className='message'>{error.message}</div>
                <div className='debug'>
                    <p>{`Error Code: ${error.code} Room ID: ${error.roomId}`}</p>
                </div>
            </div>
            <style jsx>
                {`
                .room-error{
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                }
                .message{
                    font-size: 48px;
                }
                .debug{
                    text-align: center;
                    font-size: 12px;
                    opacity: 0.5;
                }
                .debug>p{

                }
                `}
            </style>
        </>
    )
}