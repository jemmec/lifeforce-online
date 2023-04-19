import { Yeseva_One } from 'next/font/google'
const titleFont = Yeseva_One({ subsets: ['latin'], weight: '400' })

export function Title() {
    return (
        <>
            <div className="title">
                <h1 className={titleFont.className}>{`Lifeforce`}</h1>
                <p>{`The lazy-life-counting application`}</p>
            </div>
            <style jsx>
                {`
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