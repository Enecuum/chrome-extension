module.exports = {
    apps: [
        {
            name: "prod",
            cwd: "./",
            script: "server.js",
            args: "",
            exec_mode: "fork",
            merge_logs: true,
            log_file: './logs/prod.log',
            watch: false
        }
    ]
}
