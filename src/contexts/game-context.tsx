import { GameState } from "@/pages";
import { createContext, useContext } from "react";

export const GameContext = createContext<{
    gameState: GameState,
    setGameState: (gameState: GameState) => void
}>({
    gameState: { playerStates: [] },
    setGameState: () => { }
});

export function useGame() {
    return useContext(GameContext);
}