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
                <h2>{`Game Settings`}</h2>
                <div className="items">
                    <RangeField
                        label="Seats"
                        disabled={!me.isHost}
                        value={room.settings.seats}
                        min={room.users.length}
                        max={12}
                        steps={1}
                        onValueChange={(value) => handleSettingsPropChange('seats', value)}
                    />
                    <RangeField
                        label="Starting life"
                        disabled={!me.isHost}
                        value={room.settings.startingLife}
                        min={10}
                        max={100}
                        steps={10}
                        onValueChange={(value) => handleSettingsPropChange('startingLife', value)}
                    />
                </div>
            </div>
            <style jsx>
                {`
            .settings{
                display: flex;
                flex-direction: column;
                justify-content: center;
                gap: var(--gap-md);
            }
            .settings > h2 {
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
    steps,
    label,
    onValueChange,
    disabled
}: {
    value: number,
    min: number,
    max: number,
    steps: number,
    label: string,
    onValueChange: (value: number) => void,
    disabled: boolean
}) {
    return (
        <>
            <div className="range-field">
                <div className="label">
                    <div>{label}</div>
                    <div>{value}</div>
                </div>
                <input
                    className="interactable"
                    type="range"
                    step={steps}
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
                        font-size: 20px;
                        display: flex;
                        flex-direction: column;
                        gap: var(--gap-sm);
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
