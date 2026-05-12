module.exports = {
  apps: [
    {
      name: "landeon-postgres",
      cwd: "/home/harry/asem/landeon",
      script: "/usr/lib/postgresql/16/bin/postgres",
      args: "-D /home/harry/asem/landeon/.postgres-data",
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
      restart_delay: 3000,
      kill_timeout: 10000,
      env: {
        PGDATA: "/home/harry/asem/landeon/.postgres-data",
      },
    },
    {
      name: "landeon-web",
      cwd: "/home/harry/asem/landeon",
      script: "./node_modules/.bin/next",
      args: "start --port 3004 --hostname 0.0.0.0",
      autorestart: true,
      max_restarts: 10,
      min_uptime: "10s",
      restart_delay: 3000,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: "3004",
      },
    },
  ],
};
