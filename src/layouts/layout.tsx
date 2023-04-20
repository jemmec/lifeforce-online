import { FadeUpMotion } from '@/components/motions';
import { useLayout } from '@/contexts/layout-context';
import { ReactNode } from 'react';
import { Transition, motion } from 'framer-motion';

const backgroundTransition: Transition = {
  duration: 0.35,
  ease: 'circOut'
};

export function Layout({ children }: {
  children: ReactNode;
}) {
  const { layout } = useLayout();
  return (
    <>
      <div className='fullscreen'>
        <div className='background'>
          <motion.svg height={`100vh`} width={`100vw`}>
            <motion.linearGradient id='bg-grad' transition={backgroundTransition} animate={{ gradientTransform: `rotate(${layout.backgroundRotation ?? 90})` }}>
              <motion.stop offset="0%" transition={backgroundTransition} animate={{ stopColor: layout.backgroundStart }} />
              <motion.stop offset="100%" transition={backgroundTransition} animate={{ stopColor: layout.backgroundEnd }} />
            </motion.linearGradient>
            <motion.rect height={`100vh`} width={`100vw`} fill='url(#bg-grad)' />
          </motion.svg>
        </div>
        <div className='app-container'>
          <FadeUpMotion timing={{ duration: 'short' }}>
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
            .background{  
              position: fixed;
              top:0;
              left: 0;
              bottom: 0;
              right: 0;
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

