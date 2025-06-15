module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testRegex: 'test/(e2e|unit)/.*\\.(test|spec)\\.ts$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    collectCoverageFrom: ['src/**/*.ts', '!src/index.ts'],
    coverageDirectory: 'coverage',
};