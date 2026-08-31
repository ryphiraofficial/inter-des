// PM2 Ecosystem — run with: pm2 start ecosystem.config.cjs --env production
module.exports = {
    apps: [
        {
            name: 'inter-des-api',
            script: 'server.js',

            // Cluster mode: one process per CPU core — free horizontal scaling
            instances: 'max',
            exec_mode: 'cluster',

            // Restart if process leaks memory past 1GB
            max_memory_restart: '1G',

            // Keep logs tidy
            out_file: './logs/out.log',
            error_file: './logs/error.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
            merge_logs: true,

            // Auto-restart on crash
            autorestart: true,
            watch: false,        // never watch in production (nodemon is for dev)
            max_restarts: 10,
            min_uptime: '5s',    // crash-loop guard

            env: {
                NODE_ENV: 'development',
                PORT: 5000
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 5000
            }
        }
    ]
};
