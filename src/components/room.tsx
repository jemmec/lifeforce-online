import { GameContext } from "@/contexts/game-context";
import { useRoom } from "@/contexts/room-context";
import { useSocket } from "@/contexts/socket-context";
import Head from "next/head";
import { useEffect } from "react";
import { Game } from "./game";
import { RoomLink } from "./room-link";
import { Settings } from "./settings";
import { Users } from "./users";
import { RoomType, SettingsType, GameStateType } from "@/types";

export function Room() {
    const { me, room, setRoom, setSettings } = useRoom();
    const { socket } = useSocket();

    useEffect(() => {
        if (socket) {
            socket.on('updated_room', (room: RoomType) => {
                setRoom(room);
            });
            socket.on('updated_settings', (settings: SettingsType) => {
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

    function handleGameStateChange(gameState: GameStateType) {
        //Push gamestate changes up to room
        setRoom({ ...room, gameState });
    }

    if (!room.gameState)
        return (
            <>
                <Head>
                    <title>{`Lifeforce | Room ${me.isHost ? '(Host)' : ''}`}</title>
                </Head>
                <div className='room'>
                    {me.isHost ? <RoomLink /> : <></>}
                    <div className='lobby'>
                        <div className='card'>
                            <Users />
                        </div>
                        <div className='card'>
                            <Settings />
                        </div>
                    </div>
                    <div className='room-actions'>
                        <button onClick={handleLeaveRoom}>Leave</button>
                        {me.isHost ? <button onClick={handleStartGame}>Start Game</button> : <></>}
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
                            width: 100%;
                            display: flex;
                            flex-direction: row;
                            gap: var(--gap-lg);
                        }
                        .card{
                            background-color: rgba(20,20,20,0.5);
                            border-radius: var(--border-radius);
                            padding: 18px;
                            width: 50%;
                        }
                        .room-actions{
                            width: 100%;
                            display: flex;
                            flex-direction: row;
                            justify-content: space-between;
                            gap: var(--gap-lg);
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

