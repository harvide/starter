export interface EmailVerificationProps {
    user: {
        id: string;
        name: string;
        emailVerified: boolean;
        email: string;
        createdAt: Date;
        updatedAt: Date;
        image?: string | null | undefined;
    };
    url: string;
    token: string;
}