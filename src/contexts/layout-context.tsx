import { ReactNode, createContext, useContext, useState } from "react";


export const LayoutContext = createContext<{
    background: string,
    setBackground: (value: string) => void
}>({
    background: '#fff',
    setBackground: () => { }
});

export function useLayout() {
    return useContext(LayoutContext);
}

export function LayoutProvider({ children }: { children: ReactNode }) {
    const [background, setBackground] = useState<string>('linear-gradient(180deg, #484c17 0%, #01100d 100%)');
    return (
        <LayoutContext.Provider value={{ background, setBackground }}>
            {children}
        </LayoutContext.Provider>
    )
}