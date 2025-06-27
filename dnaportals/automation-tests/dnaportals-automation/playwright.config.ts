import { defineConfig } from '@playwright/test';
import ENV from './support/utils/environment/Env';

export default defineConfig({
    workers: undefined,
    maxFailures: process.env.CI ? 10 : undefined,
    globalSetup: 'support/utils/environment/globalSetup.ts',
    timeout: 60000,
    testDir: './tests',
    fullyParallel: true,
    use: {
        headless: true,
        baseURL: ENV.DOMAIN,
        trace: 'retain-on-failure',
        viewport: {
            width: 1920,
            height: 1080,
        },
        actionTimeout: 15000,
        ignoreHTTPSErrors: true,
        video: 'off',
        screenshot: 'off',
        testIdAttribute: 'data-pw',
    },
    reporter: [
        ['list'],
        ['html', { outputFolder: 'pw-test-results' }],
        ['junit', { outputFile: 'pw-test-results/junit-results.xml' }],
        [
            './support/utils/zephyr-reporter.ts',
            {
                url: 'https://jira.admiral.uk/rest/atm/1.0/testrun', //Example
                projectKey: 'DTZ',
                name: 'DnA_Portals_Pricing',
            },
        ],
    ],
    projects: [
        { name: 'setup', testMatch: /.*global\.setup\.ts/ },
        {
            name: 'Microsoft Edge',
            use: {
                channel: 'msedge',
                storageState: '.auth/user.json',
                launchOptions: {
                    args: ['--auth-server-allowlist="*"'],
                },
            },
            dependencies: ['setup'],
        },
        { name: 'teardown', testMatch: /.*global\.teardown\.ts/, dependencies: ['setup', 'Microsoft Edge'] },
    ],
});
