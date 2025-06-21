export type LoginFormProps = React.ComponentProps<"div"> & {
    className?: string;

    header?: React.ReactNode;
    subtitle?: React.ReactNode;

    // Used in admin signup flow
    forceEmailAndPasswordOnly?: boolean;
};