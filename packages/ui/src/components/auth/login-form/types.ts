export type LoginFormProps = React.ComponentProps<"div"> & {
    className?: string;

    // The URL to redirect to after successful login
    callbackUrl?: string;

    header?: React.ReactNode;
    subtitle?: React.ReactNode;

    // Used in admin signup flow
    forceEmailAndPasswordOnly?: boolean;
};