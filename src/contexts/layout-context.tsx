import { ReactNode, createContext, useContext, useState } from "react";

export type LayoutType = {
    backgroundStart: string;
    backgroundEnd: string;
}

//Default type
const def: LayoutType = {
    backgroundStart: '#484c17',
    backgroundEnd: '#01100d'
}

export const LayoutContext = createContext<{
    layout: LayoutType,
    setLayout: (layout: LayoutType) => void
}>({
    layout: def,
    setLayout: () => { }
});

export function useLayout() {
    return useContext(LayoutContext);
}

export function LayoutProvider({ children }: { children: ReactNode }) {
    const [layout, setLayout] = useState<LayoutType>(def);
    return (
        <LayoutContext.Provider value={{ layout, setLayout }}>
            {children}
        </LayoutContext.Provider>
    )
}