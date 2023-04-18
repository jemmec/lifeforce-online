import Head from "next/head";
import { SmallText } from "./small-text";
import { useVisible } from "@/hooks/use-visble";
import { ReactNode, useRef } from "react";

export function Home({ onNewRoom }: {
  onNewRoom: () => void;
}) {
  const pageRef = useRef<any>();

  //TODO: create layout wrapper that does this opacity stuff
  useVisible(() => {
    pageRef.current.classList.add("visible");
  }, () => {
    pageRef.current.classList.remove("visible");
  });

  return (
    <>
      <Head>
        <title>{`Lifeforce`}</title>
      </Head>
      <div className='home' ref={pageRef}>
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
              opacity: 0;
              transition: opacity 2s;
            }
            .home.visible{
              opacity: 1;
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