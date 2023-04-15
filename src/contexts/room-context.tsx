import { Room, User } from "@/pages";
import { createContext, useContext, useEffect, useState } from "react";
import { Socket, io } from "socket.io-client";

export const RoomContext = createContext<{ room: Room, setRoom: (room: Room | null) => void }>({ room: { id: '', users: [] }, setRoom: () => { } });

export function useRoom() {
    return useContext(RoomContext);
}
