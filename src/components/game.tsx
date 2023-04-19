import { useGame } from "@/contexts/game-context";
import { useRoom } from "@/contexts/room-context";
import { useSocket } from "@/contexts/socket-context";
import { GameStateType, PlayerStateType, UserType } from "@/types";
import Head from "next/head";
import { useState, useEffect } from "react";
import { SyncIcon, SignOutIcon } from "@primer/octicons-react";

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
      <div className="game">
        <div className="enemy-list">
          {
            gameState.playerStates.map(playerState => {
              //Get user info from the room
              const user = room.users.find(x => x.id === playerState.userId);
              //Early out if me
              if (!user || user === me) return <></>;
              return (
                <Enemy playerState={playerState} user={user} />
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
          me.isHost ? <div className="host-actions">
            <button onClick={handleResetGame}>{`Reset `}<SyncIcon size={22}/></button>
            <button onClick={handleBackToLobby}>{`Back To Lobby `}<SignOutIcon size={22}/></button>
          </div> : <></>
        }
      </div>
      <style jsx>
        {`
            .game{
              width: 100%;
            }
            .enemy-list{
              display: flex;
            }



            .host-actions{
              display: flex;
              flex-direction: row;
              justify-content: space-evenly;
            }
          `}
      </style>
    </>
  )
}

function Enemy({ playerState, user }: { playerState: PlayerStateType, user: UserType }) {
  return (
    <>
      <div key={playerState.userId} className="enemy">
        <div className="name">{user.name}</div>
        <div className="life">{playerState.life}</div>
      </div>
      <style jsx>
        {`
        .enemy{
          background-color: ${user.color};
          color: black;
          border-radius: var(--border-radius);
          padding: 24px;

          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .name{
          font-size: 20px;
          font-weight: 400;
        }
        .life{
          font-size: 48px;
          font-weight: 700;
        }
        `}
      </style>
    </>
  )
}

function Me() {

}