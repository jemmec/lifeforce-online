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
            <h1 className={titleFont.className}>{`Lifeforce`}</h1>
            {children}
          </div>
        </div>
        <style jsx>
          {`
            h1{
              font-size: 48px;
            }
            .fullscreen{
              width: 100vw;
              height: 100vh;
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
            }
            .app-container{
              max-width: 720px;
              width: 100%;
              display: flex;
              flex-direction: column;
              justify-content: flex-start;
              align-items: center;
              gap: var(--gap-lg);
            }
          `}
        </style>
      </>
    )
  }
  
  