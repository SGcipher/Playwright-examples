import ENV from '../utils/environment/Env';

type TokenRequest = {
    url: string;
    options: {
        data: {
            googleClientId?: string;
            googleClientSecret?: string;
            email?: string;
        };
        ignoreHTTPSErrors?: boolean;
    };
};

const tokenRequest: TokenRequest = {
    url: '',
    options: {
        data: {},
        ignoreHTTPSErrors: true,
    },
};

export const authApiObjects = {
    getAuthAccessToken() {
        tokenRequest.url = `./api/auth/accessToken`;
        tokenRequest.options.data.googleClientId = ENV.GOOGLE_CLIENT_ID;
        tokenRequest.options.data.googleClientSecret = ENV.GOOGLE_CLIENT_SECRET;
        tokenRequest.options.data.email = ENV.SVC_USER;
        return tokenRequest;
    };
};
