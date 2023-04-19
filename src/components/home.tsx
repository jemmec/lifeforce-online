import Head from "next/head";
import { SmallText } from "./small-text";

export function Home({ onNewRoom }: {
  onNewRoom: () => void;
}) {

  return (
    <>
      <Head>
        <title>{`Lifeforce`}</title>
      </Head>
      <div className='home' >
        <button className="glow-button" onClick={onNewRoom}>{`New Game`}</button>
        <SmallText />
      </div>
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