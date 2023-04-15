import { useRoom } from "@/contexts/room-context";
import { useSocket } from "@/contexts/socket-context";
import { User } from "@/pages";
import { useEffect, useState } from "react";

export function useMe() {
    const { socket } = useSocket();
    const { room, setRoom } = useRoom();
    const [me, setMe] = useState<User | null>(null);
    useEffect(() => {
        if (socket && room) {
            const user = room.users.find(x => x.id === socket.id);
            if (user)
                setMe(user);
        }
    }, [socket, room])
    return { me };
}