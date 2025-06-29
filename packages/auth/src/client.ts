import { adminClient, emailOTPClient, phoneNumberClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    plugins: [
        emailOTPClient(),
        phoneNumberClient(),
        adminClient()
    ],
})

export type Session = typeof authClient.$Infer.Session
export type User = typeof authClient.$Infer.Session.user