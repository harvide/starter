import { config } from "@repo/config"
import { createAuthClient } from "better-auth/react"
 
export const authClient =  createAuthClient({
    baseURL: config.urls.client,
})

export const {
    signIn,
    signOut,
    signUp,
    useSession
} = authClient;