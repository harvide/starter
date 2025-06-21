import { emailOTPClient, phoneNumberClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react"

export const authClient = createAuthClient({
    plugins: [
        emailOTPClient(),
        phoneNumberClient()
    ],
})

export const {
    signIn,
    signOut,
    signUp,
    useSession
} = authClient;