import { type EmailAddress } from "../../config/src/schema";

export function formatEmailAddress(email: EmailAddress | string) {
    if (typeof email === "string") {
        return email;
    } else if (typeof email === "object" && email.email) {
        return email.name ? `"${email.name}" <${email.email}>` : email.email;
    } else {
        throw new Error("Invalid email address format");
    }
}