import { Room, Settings, User } from "@/pages";
import { createContext, useContext } from "react";

export const RoomContext = createContext<{
    me: User,
    room: Room,
    setRoom: (room: Room | null) => void,
    setSettings: (settings: Settings) => void,
}>({
    me: { id: '', color: '', isHost: false, name: '' },
    room: { id: '', users: [], settings: { startingLife: 40 }, gameState: null },
    setRoom: () => { },
    setSettings: () => { }
});

export function useRoom() {
    return useContext(RoomContext);
}
