import { useRoom } from "@/contexts/room-context";
import { useState } from "react";

export function RoomLink() {
    const { room } = useRoom();
    const [copied, setCopied] = useState(false);
  
    function handleLinkCopy() {
      setCopied(true);
      navigator.clipboard.writeText(`http://localhost:3000/?roomId=${room.id}`);
    }
  
    return (
      <>
        <div className='room-link'>
          <div>{`Share the link:`}</div>
          <button className='link' onClick={handleLinkCopy}>
            {copied ? 'Copied!' : `http://localhost:3000/?roomId=${room.id}`}
          </button>
        </div>
        <style jsx>
          {`
            .room-link{
              width: 100%;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: var(--gap-sm);
            }
            .link{
              text-decoration: underline;
            }
          `}
        </style>
      </>
    )
  }
  