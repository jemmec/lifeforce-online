import { useRoom } from "@/contexts/room-context";
import { useSocket } from "@/contexts/socket-context";

export function Settings() {

    const { socket } = useSocket();
    const { me, room, setSettings } = useRoom();

    function handleSettingsPropChange(prop: string, value: any) {
        if (socket) {
            const settings = { ...room.settings, [prop]: value };
            setSettings(settings);
            socket.emit('update_settings', room.id, settings,)
        }
    }

    return (
        <>
            <div className='settings'>
                <h3>{`Game Settings`}</h3>
                <div className="items">
                    <RangeField disabled={!me.isHost} value={room.settings.startingLife} min={1} max={100} onValueChange={(value) => handleSettingsPropChange('startingLife', value)} />
                </div>
            </div>
            <style jsx>
                {`
            .settings{
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: var(--gap-sm);
            }
            .settings > h3 {
                align-self: center;
            }
            .items
            {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
            }
          `}
            </style>
        </>
    )
}

export function RangeField({
    value,
    min,
    max,
    onValueChange,
    disabled
}: {
    value: number,
    min: number,
    max: number,
    onValueChange: (value: number) => void,
    disabled: boolean
}) {
    return (
        <>
            <div className="range-field">
                <div className="label">
                    <div>{`Starting life`}</div>
                    <div>{value}</div>
                </div>
                <input
                    type="range"
                    min={min}
                    max={max}
                    disabled={disabled}
                    value={value}
                    onChange={(e) => onValueChange(Number.parseInt(e.target.value))}
                />
            </div>
            <style jsx>
                {`
                    .range-field{
                        display: flex;
                        flex-direction: column;
                    }
                    .label{
                        display: flex;
                        flex-direction: row;
                        justify-content: space-between;
                    }
                `}
            </style>
        </>
    )
}
