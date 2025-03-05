type User = {
    id: string;
    email: string;
    name: string;
    role?: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
};

export interface IAuthenticate {
    readonly user: User;
    readonly token: string;
}