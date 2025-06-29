import type { HTMLMotionProps } from "framer-motion";

type MotionDivProps = HTMLMotionProps<'div'> & {
    className?: string;
};

export type LoginFormProps = MotionDivProps & {
    className?: string;

    // The URL to redirect to after successful login
    callbackUrl?: string;

    header?: React.ReactNode;
    subtitle?: React.ReactNode;

    // Used in admin signup flow
    forceEmailAndPasswordOnly?: boolean;
};