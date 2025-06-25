export default [
    {
        context: [
            '/api',
            '/user',
        ],
        target: 'http://localhost:3000',
        secure: false,
        logLevel: "debug"
    }
];