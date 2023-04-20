import { FadeUpMotion } from "./motions";

export function ColorWidget({ colors, show, onChange }: {
    colors: string[],
    show: boolean,
    onChange: (color: string) => void
}) {
    if (!show) return <></>;
    return (
        <>
            <FadeUpMotion timing={{ duration: 'short' }}>
                <div className="color-widget">
                    <div className="grid">
                        {colors.map(color => <div key={color} className="color interactable" onClick={() => onChange(color)} style={{ background: color }} />)}
                    </div>
                </div>
            </FadeUpMotion>
            <style jsx>
                {`
                    .color-widget{
                        --color-size: 32px;
                        position: absolute;
                        bottom: 10px;
                        left: 0;
                        background-color: rgb(22, 22, 22);
                        border-radius: var(--border-radius);
                        padding: var(--gap-sm);
                        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
                    }
                    .grid{
                        display: grid;
                        grid-template-columns: var(--color-size) var(--color-size) var(--color-size) var(--color-size);
                        gap: var(--gap-sm);
                    }
                    .color{
                        width: var(--color-size);
                        height: var(--color-size);
                        min-width: var(--color-size);
                        min-height: var(--color-size);
                        border-radius: 8px;
                    }
                `}
            </style>
        </>
    )
}