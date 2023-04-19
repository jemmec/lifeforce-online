import { motion } from 'framer-motion';
import { Yeseva_One } from 'next/font/google'
import { ReactNode } from 'react';
const titleFont = Yeseva_One({ subsets: ['latin'], weight: '400' })


export function Layout({ children }: {
  children: ReactNode;
}) {
  return (
    <>
      <div className='fullscreen'>
        <div className='app-container'>
          <div className="title">
            <h1 className={titleFont.className}>{`Lifeforce`}</h1>
            <p>{`The lazy-life-counting application`}</p>
          </div>
          {children}
        </div>
      </div>
      <style jsx>
        {`
            .fullscreen{
              width: 100vw;
              height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }
            .app-container{
              padding: 12px;
              max-width: var(--max-width);
              width: 100%;
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: center;
              gap: var(--gap-lg);
            }
            .title{
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: center;
            }
            h1{
              font-size: 48px;
              text-decoration: underline;
            }
            p{
              font-weight: 300;
            }
          `}
      </style>
    </>
  )
}

