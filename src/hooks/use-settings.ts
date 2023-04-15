import { useRoom } from "@/contexts/room-context";
import { Settings } from "@/pages";
import { useEffect, useState } from "react";

export function useSettings() {
    const { room } = useRoom();
    const [settings, setSettings] = useState<Settings | null>(null)
    useEffect(() => {
        if (room) {
            setSettings(room.settings);
        }
    }, [room])
    return { settings };
}