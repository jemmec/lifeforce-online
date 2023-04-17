import { GameStateType } from "@/types";
import { createContext, useContext } from "react";

export const GameContext = createContext<{
    gameState: GameStateType,
    setGameState: (gameState: GameStateType) => void
}>({
    gameState: { playerStates: [] },
    setGameState: () => { }
});

export function useGame() {
    return useContext(GameContext);
}