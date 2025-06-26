import React from "react";
import { Tailwind } from "@react-email/tailwind";

type EmailBaseProps = {
    children: React.ReactNode;
}

export const EmailBase = ({ children }: EmailBaseProps) => {
    return (
        <Tailwind
            config={{
                theme: {
                    extend: {
                        colors: {
                            background: "oklch(1.00 0 0)",
                            foreground: "oklch(0.26 0 0)",
                            card: "oklch(1.00 0 0)",
                            "card-foreground": "oklch(0.26 0 0)",
                            popover: "oklch(1.00 0 0)",
                            "popover-foreground": "oklch(0.16 0 0)",
                            primary: "oklch(0.33 0 0)",
                            "primary-foreground": "oklch(0.99 0 0)",
                            secondary: "oklch(0.98 0 0)",
                            "secondary-foreground": "oklch(0.33 0 0)",
                            muted: "oklch(0.98 0 0)",
                            "muted-foreground": "oklch(0.65 0 0)",
                            accent: "oklch(0.98 0 0)",
                            "accent-foreground": "oklch(0.33 0 0)",
                            destructive: "oklch(0.62 0.21 25.77)",
                            "destructive-foreground": "oklch(1.00 0 0)",
                            border: "oklch(0.94 0 0)",
                            input: "oklch(0.94 0 0)",
                            ring: "oklch(0.77 0 0)",
                        },
                        borderRadius: {
                            lg: "1rem",
                            md: "calc(1rem - 2px)",
                            sm: "calc(1rem - 4px)"
                        }
                    },
                },
            }}
        >
            {children}
        </Tailwind>
    )
}
