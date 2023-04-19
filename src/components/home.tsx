import Head from "next/head";
import { SmallText } from "./small-text";
import { FadeUpMotion } from "./motions";
import { Title } from "./title";

export function Home({ onNewRoom }: {
  onNewRoom: () => void;
}) {

  return (
    <>
      <Head>
        <title>{`Lifeforce`}</title>
      </Head>
      <div className='home' >
        <Title />
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