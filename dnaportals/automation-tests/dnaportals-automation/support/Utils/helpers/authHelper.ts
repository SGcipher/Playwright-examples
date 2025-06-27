import { GoogleAuth } from 'google-auth-library';

export class AuthHelper {
    private keyFilePath: string;

    constructor(keyFilePath: string) {
        this.keyFilePath = keyFilePath;
    }

    public async generateIdentityToken (targetAudience: string = ''): Promise<string> {
        const auth = new GoogleAuth({
            keyFile: this.keyFilePath,
        });

        const client = await auth.getIdTokenClient(targetAudience);
        const idToken = await client.idTokenProvider.fetchIdToken(targetAudience);

        if(!idToken) {
            throw new Error('Failed to generate id token');
        }
        return idToken;
    }
}