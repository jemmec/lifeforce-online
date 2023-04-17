import { useGame } from "@/contexts/game-context";
import { useRoom } from "@/contexts/room-context";
import { useSocket } from "@/contexts/socket-context";
import { GameStateType, PlayerStateType } from "@/types";
import  Head  from "next/head";
import { useState, useEffect } from "react";

export function Game() {
    const { socket } = useSocket();
    const { gameState, setGameState } = useGame();
    const { me, room } = useRoom();
    const [myState, setMyState] = useState<PlayerStateType | null>();
  
    useEffect(() => {
      const ms = gameState.playerStates.find(x => x.userId === me.id);
      if (ms)
        setMyState(ms);
    }, [me, gameState]);
  
    useEffect(() => {
      if (socket) {
        socket.on('updated_gamestate', (gameState: GameStateType) => {
          setGameState(gameState);
        });
      }
    }, [socket])
  
    function handleModLife(value: number) {
      if (socket && myState) {
        //update local state
        setMyState({ ...myState, life: myState.life += value });
        socket.emit('mod_life', room.id, value);
      }
    }
  
    function handleModOtherLife(value: number) {
      if (socket) {
        //update local state
  
        socket.emit('mod_other_life', room.id, value);
      }
    }
  
    function handleResetGame() {
      if (socket) {
        socket.emit('reset_game', room.id);
      }
    }
  
    function handleBackToLobby() {
      if (socket) {
        socket.emit('end_game', room.id);
      }
    }
  
    if (!myState) return <div>{`Game in progress...`}</div>
  
    return (
      <>
        <Head>
          <title>{`Lifeforce | In Game`}</title>
        </Head>
        <div>
          <div>
            {
              gameState.playerStates.map(playerState => {
                //Get user info from the room
                const user = room.users.find(x => x.id === playerState.userId);
                if (!user || user === me) return <></>;
                return (
                  <>
                    <div key={playerState.userId} >
                      <div>{user.name}</div>
                      <h3>{playerState.life}</h3>
                    </div>
                  </>
                );
              })
            }
          </div>
          <div>
            <button onClick={() => handleModOtherLife(-1)}>{`decrease other`}</button>
            <button onClick={() => handleModOtherLife(+1)}>{`increase other`}</button>
          </div>
          <div>
            <button onClick={() => handleModLife(-1)}>{`decrease`}</button>
            <h1>{myState.life}</h1>
            <button onClick={() => handleModLife(+1)}>{`increase`}</button>
          </div>
          {
            me.isHost ? <>
              <button onClick={handleResetGame}>{`reset`}</button>
              <button onClick={handleBackToLobby}>{`back to lobby`}</button>
            </> : <></>
          }
        </div>
      </>
    )
  
  }