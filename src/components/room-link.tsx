import { useRoom } from "@/contexts/room-context";
import { motion } from "framer-motion";
import { useState } from "react";

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
  const [copied, setCopied] = useState(false);
  function handleLinkCopy() {
    setCopied(true);
    navigator.clipboard.writeText(url);
  }
  return (
    <>
      <div className="copy-link">
        <motion.div>
          <div className='link interactable' onClick={handleLinkCopy}>
            {url}
          </div>
        </motion.div>
        <div className="absolute">
          <motion.div initial={{ opacity: 0, transform: 'translateY(20px)' }} animate={copied ? { opacity: 1, transform: 'translateY(0)' } : {}}>
            {`Copied!`}
          </motion.div>
        </div>
      </div>
      <style jsx>
        {`
        .copy-link{
          position: relative;
          color: black;
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
        }
        .link{
          text-decoration: underline;
          cursor: pointer;
        }
        .absolute{
          font-size: 18px;
          position: absolute;
          top: -30px;
          right: 0;
          color: rgb(26, 196, 223);
          padding: 4px 8px;
          border-radius: var(--border-radius);
        }
        `}
      </style>
    </>
  )
}
