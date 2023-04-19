import { FadeUpMotion } from '@/components/motions';
import { ReactNode } from 'react';



export function Layout({ children }: {
  children: ReactNode;
}) {
  return (
    <>
      <div className='fullscreen'>
        <div className='app-container'>
          <FadeUpMotion timing={{duration: 'short'}}>
            <div className='main'>
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
          `}
      </style>
    </>
  )
}

