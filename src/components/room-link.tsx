import { useRoom } from "@/contexts/room-context";
import { motion } from "framer-motion";
import { useState } from "react";
import { CopyIcon } from "@primer/octicons-react";

export function RoomLink() {
  const { room } = useRoom();
  return (
    <>
      <div className='room-link'>
        <div className="info">{`Share the link:`}</div>
        <CopyLink url={`http://localhost:3000/?roomId=${room.id}`} />
      </div>
      <style jsx>
        {`
            .room-link{
              width: 100%;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              gap: var(--gap-sm);
            }
            .info{
              font-size: 22px;
            }
          `}
      </style>
    </>
  )
}

export function CopyLink({ url }: { url: string }) {
  //TODO: Add timer

  const [copied, setCopied] = useState(false);
  function handleLinkCopy() {
    setCopied(true);
    navigator.clipboard.writeText(url);
  }
  return (
    <>
      <div className="copy-link interactable shadow-sm" onClick={handleLinkCopy}>
        <motion.div transition={{ duration: 0.2 }} initial={{ opacity: 1 }} animate={copied ? { opacity: 0 } : {}}>
          <div className='link'>
            {url}
          </div>
        </motion.div>
        <div className="absolute">
          <motion.div transition={{ duration: 0.2 }} initial={{ opacity: 0 }} animate={copied ? { opacity: 1 } : {}}>
            <div>
              {`Copied `}
              <CopyIcon size={22} />
            </div>
          </motion.div>
        </div>
      </div>
      <style jsx>
        {`
        .copy-link{
          position: relative;
          color: rgb(20,20,20);
          font-size: 22px;
          font-weight: 600;
          width: 100%;
          text-align: center;
          display: flex;
          flex-direction: row;
          justify-content: center;
          gap: var(--gap-md);
          border-radius: var(--border-radius);
          padding: 12px;
          background-color: rgba(200,200,200,0.5);
          cursor: pointer;
        }
        .link{
          text-decoration: underline;
        }
        .absolute{
          position: absolute;
          right: 0; left: 0;
          border-radius: var(--border-radius);
        }
        `}
      </style>
    </>
  )
}
