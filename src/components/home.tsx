import Head from "next/head";
import { SmallText } from "./small-text";
import { motion } from "framer-motion"

export function Home({ onNewRoom }: {
  onNewRoom: () => void;
}) {

  return (
    <>
      <Head>
        <title>{`Lifeforce`}</title>
      </Head>
      <motion.div transition={{ duration: 0.15 }} initial={{ opacity: 0 }} animate={{ opacity: 1}} >
        <div className='home' >
          <button className="glow-button" onClick={onNewRoom}>{`New Game`}</button>
          <SmallText />
        </div>
      </motion.div>
      <style jsx>
        {`
            .home{
              padding: 12px;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: var(--gap-lg);
            }
          `}
      </style>
    </>
  )
}