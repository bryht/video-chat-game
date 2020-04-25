export class User {
    id: string = '';
    name?: string = '';
    photo: string = '';
    provider: 'google' | 'email' | 'phone' | null = null;
    accessToken: string = '';
    expireDate: Date | null = null;
    culture: string | null = null;
    refreshToken: string = '';
}
