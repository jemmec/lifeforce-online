import { Room, User } from "@/pages";
import { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

export const RoomContext = createContext<{
    me: User,
    room: Room,
    setRoom: (room: Room | null) => void,
}>({
    me: { id: '', color: '', isHost: false, life: 40, name: '' },
    room: { id: '', users: [], settings: { startingLife: 40 } },
    setRoom: () => { }
});

export function useRoom() {
    return useContext(RoomContext);
}
