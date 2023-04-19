import { motion } from "framer-motion";
import { ReactNode } from "react";

export type Duration = 'short' | 'medium' | 'long' | 'extra';

function getDuration(duration: Duration): number {
    switch (duration) {
        case "short":
            return 0.1;
        case "medium":
            return 0.35;
        case "long":
            return 0.55;
        case "extra":
            return 0.8;
    }
}

export type Easing =
    'linear' | 'standard' | 'standard.acc' | 'standard.dec' |
    'emphasized' | 'emphasized.dec' | 'emphasized.acc';

export type TimingProps = {
    duration?: Duration,
    easing?: Easing,
}

export function FadeUpMotion({ children, timing }: { children: ReactNode, timing?: TimingProps }) {
    return (
        <motion.div
            transition={{ duration: getDuration(timing?.duration ?? 'medium') }}
            initial={{ opacity: 0, transform: 'translateY(25px) scale(0.9)' }}
            animate={{ opacity: 1, transform: 'translateY(0) scale(1)' }}
        >
            {children}
        </motion.div>
    );
}

export function FadeLeftMotion({ children, timing }: { children: ReactNode, timing?: TimingProps }) {
    return (
        <motion.div
            transition={{ duration: getDuration(timing?.duration ?? 'medium') }}
            initial={{ opacity: 0, transform: 'translateX(-25px) scale(0.9)' }}
            animate={{ opacity: 1, transform: 'translateX(0) scale(1)' }}
        >
            {children}
        </motion.div>
    );
}
