import { FadeUpMotion } from '@/components/motions';
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
          <FadeUpMotion timing={{duration: 'short'}}>
            <div className='main'>
              <div className="title">
                <h1 className={titleFont.className}>{`Lifeforce`}</h1>
                <p>{`The lazy-life-counting application`}</p>
              </div>
              {children}
            </div>
          </FadeUpMotion>
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
            }
            .main{
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
              border-width: 2px;
              border-style: solid;
              border-radius: 8px;
              padding-bottom: 6px;
              padding-left: 6px;
              padding-right: 6px;
            }
            h1{
              font-size: 48px;
              text-decoration: underline;
            }
            p{
              font-weight: 350;
              font-size: 14px;
            }
          `}
      </style>
    </>
  )
}

