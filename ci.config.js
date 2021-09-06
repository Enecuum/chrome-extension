module.exports = {
    apps: [
        {
            name: "ci",
            cwd: "./",
            script: "ci.js",
            args: "",
            exec_mode: "fork",
            merge_logs: true,
            log_file: './logs/ci.log',
            watch: false
        }
    ]
}
