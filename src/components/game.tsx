import { useGame } from "@/contexts/game-context";
import { useRoom } from "@/contexts/room-context";
import { useSocket } from "@/contexts/socket-context";
import { GameStateType, PlayerStateType, UserType } from "@/types";
import Head from "next/head";
import { useState, useEffect } from "react";
import { SyncIcon, SignOutIcon } from "@primer/octicons-react";
import { motion } from "framer-motion";

export function Game() {
  const { socket } = useSocket();
  const { gameState, setGameState } = useGame();
  const { me, room } = useRoom();

  useEffect(() => {
    if (socket) {
      socket.on('updated_gamestate', (gameState: GameStateType) => {
        setGameState(gameState);
      });
    }
  }, [socket])

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

  return (
    <>
      <Head>
        <title>{`Lifeforce | In Game`}</title>
      </Head>
      <div className="game">
        {
          me.isHost ? <div className="host-actions">
            <button onClick={handleBackToLobby}><SignOutIcon size={22} /></button>
            <button onClick={handleResetGame}>{`Reset `}<SyncIcon size={22} /></button>
          </div> : <></>
        }
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
        <Me />
      </div>
      <style jsx>
        {`
            .game{
              width: 100%;
              display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
                gap: var(--gap-md);
            }
            .enemy-list{
              display: flex;
              flex-direction: row;
              justify-content: center;
              flex-wrap: wrap;
              gap: var(--gap-sm);
              padding: 12px;
            }
            .host-actions{
              width: 100%;
              display: flex;
              flex-direction: row;
              justify-content: space-between;
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
          color: rgb(15,15,15);
          border-radius: var(--border-radius);
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 200px;
          height: 150px;
        }
        .name{
          font-size: 20px;
          font-weight: 500;
          opacity: 0.75;
          text-align: center;
        }
        .life{
          font-size: 72px;
          font-weight: 700;
          opacity: 0.8;
        }
        `}
      </style>
    </>
  )
}

function Me() {
  const { socket } = useSocket();
  const { gameState, setGameState } = useGame();
  const { me, room } = useRoom();
  const [myState, setMyState] = useState<PlayerStateType | null>();

  useEffect(() => {
    const ms = gameState.playerStates.find(x => x.userId === me.id);
    if (ms)
      setMyState(ms);
  }, [me, gameState]);

  function handleModLife(value: number) {
    if (socket && myState) {
      //update local state
      setMyState({ ...myState, life: myState.life += value });
      socket.emit('mod_life', room.id, value);
    }
  }
  return (
    <>
      {
        myState ?
          <motion.div whileTap={{ scale: 0.97 }} transition={{ duration: 0.08 }} style={{ width: '100%' }}>
            <div className="me">
              <div className="zone">
                <div className="mod-button interactable" onClick={() => handleModLife(-1)} ></div>
                <div className="mod-button interactable" onClick={() => handleModLife(-5)} ></div>
                <div className="absolute">
                  <div className="symbol">{`-`}</div>
                </div>
              </div>
              <div className="zone">
                <div className="mod-button interactable" onClick={() => handleModLife(+1)} ></div>
                <div className="mod-button interactable" onClick={() => handleModLife(+5)} ></div>
                <div className="absolute">
                  <div className="symbol">{`+`}</div>
                </div>
              </div>
              <div className="absolute">
                <div className="life">{myState.life}</div>
              </div>
            </div>
          </motion.div> :
          <div className="no-state">{`Please wait for the active game to end.`}</div>
      }
      <style jsx>
        {`
        .me{
          width: 100%;
          background-color: ${me.color};
          color: rgb(15,15,15);
          border-radius: var(--border-radius);
          position: relative;
          display: flex;
          flex-direction: row;
        }
        .absolute{
          position: absolute;
          left: 0; 
          right: 0; 
          bottom: 0;
          top: 0;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
        }
        .life{
          line-height: 0px;
          font-size: 82px;
          font-weight: 700;
          opacity: 0.8;
        }
        .zone{
          width: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
        }
        .mod-button{
          cursor: pointer;
          height: 80px;
        }
        .symbol{
          line-height: 0px;
          font-size: 96px;
          font-weight: 300;
          opacity: 0.5;
        }
        .no-state{
          width: 100%;
          text-align: center;
        }
        `}
      </style>
    </>
  )
}