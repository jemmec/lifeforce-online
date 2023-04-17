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
        <div className='home'>
          <button onClick={onNewRoom}>{`New Game`}</button>
        </div>
        <SmallText />
        <style jsx>
          {`
            .home{
              padding: 12px;
            }
          `}
        </style>
      </>
    )
  }