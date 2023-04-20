export function SmallText() {
  return (
    <>
      <div className='small-text'>
        <div>{`Lifeforce © 2023 all rights belong to the person whom rights they belong. Please do not put your hand over an open flame. It is of the express interest of everyone that we remain calm. Try not to put excessive dedorant on in the mornings.`}</div>
        <div>{`Made by `}<a href="https://github.com/jemmec">{`@jemmec`}</a></div>
      </div>
      <style jsx>
        {`
            .small-text{
              opacity: 0.35;
              font-size: 12px;
              text-align: center;
            }
          `}
      </style>
    </>
  )
}