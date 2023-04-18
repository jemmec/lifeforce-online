import { useEffect } from "react";

export function useVisible(onLoaded: () => void, onUnloaded: () => void) {
    useEffect(() => {
        const onPageLoad = () => {
            onLoaded();
        };
        // Check if the page has already loaded
        if (document.readyState === 'complete') {
            onPageLoad();
        } else {
            window.addEventListener('load', onPageLoad);
            // Remove the event listener when component unmounts
            return () => {
                window.removeEventListener('load', onPageLoad);
                onUnloaded();
            };
        }
    }, []);
}