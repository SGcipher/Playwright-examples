import dotenv from 'dotenv';

async function globalSetup() {
    if (!process.env.CI) {
        dotenv.config({
            path: process.env.TEST_ENV
              ? `support/utils/environment/.env.${process.env.TEST_ENV}`
              : 'support/utils/environment/.env.dev',
            override: true,
        });
    }
}
export default globalSetup;