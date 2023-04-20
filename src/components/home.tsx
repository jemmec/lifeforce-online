import Head from "next/head";
import { SmallText } from "./small-text";
import { Title } from "./title";
import { useLayout } from "@/contexts/layout-context";
import { useEffect } from "react";

export function Home({ onNewRoom }: {
  onNewRoom: () => void;
}) {
  const { setLayout } = useLayout();
  useEffect(()=>{
    setLayout({
      backgroundStart: '#484c17',
      backgroundEnd: '#01100d'
    });
  },[]);
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