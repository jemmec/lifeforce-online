export function SmallText() {
    return (
      <>
        <div className='small-text'>
          {`Lifeforce is an open source project created by @jemmec. Sit minim cupidatat in duis esse do. Ad exercitation tempor ipsum Lorem anim excepteur elit ut nulla nostrud. Quis eu et nostrud excepteur proident nulla qui ut ullamco dolore excepteur.`}
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