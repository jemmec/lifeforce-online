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
        <button className="glow-button" onClick={onNewRoom}>{`New Game`}</button>
      </div>
      <SmallText />
      <style jsx>
        {`
            .home{
              padding: 12px;
            }
            .home>button{
              transition: box-shadow 0.2s ease-out;
            }
            .home>button:hover{
              box-shadow: rgba(46, 240, 182, 0.4) 0px 0px 10px, 
                                    rgba(46, 201, 240, 0.3) 0px 0px 25px, 
                                    rgba(46, 240, 227, 0.2) 0px 0px  40px;
            }
          `}
      </style>
    </>
  )
}