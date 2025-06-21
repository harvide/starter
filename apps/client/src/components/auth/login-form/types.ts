export type LoginFormProps = React.ComponentProps<"div"> & {
    className?: string;

    // Used in admin signup flow
    forceEmailAndPasswordOnly?: boolean;
};