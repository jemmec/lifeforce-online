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
          <div>
            <div>{`Starting life: `}</div>
            <div>{room.settings.startingLife}</div>
            <input
              type="range"
              min={1}
              max={80}
              disabled={!me.isHost}
              value={room.settings.startingLife}
              onChange={(e) => handleSettingsPropChange('startingLife', Number.parseInt(e.target.value))}
            />
          </div>
        </div>
        <style jsx>
          {`
            .settings{
  
            }
          `}
        </style>
      </>
    )
  }
  
  