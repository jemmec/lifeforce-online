import { RoomType, SettingsType, UserType } from "@/types";
import { createContext, useContext } from "react";

export const RoomContext = createContext<{
    me: UserType,
    room: RoomType,
    setRoom: (room: RoomType | null) => void,
    setSettings: (settings: SettingsType) => void,
}>({
    me: { id: '', color: '', isHost: false, name: '' },
    room: { id: '', users: [], settings: { startingLife: 40 }, gameState: null },
    setRoom: () => { },
    setSettings: () => { }
});

export function useRoom() {
    return useContext(RoomContext);
}
