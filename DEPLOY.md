# Deployment Guide (Hetzner / VPS)

This guide explains how to deploy the Law Firm Expense Tracker to a VPS (Virtual Private Server) like Hetzner, DigitalOcean, etc.

## Prerequisites

1.  **VPS**: A server running Linux (Ubuntu 22.04/24.04 recommended).
2.  **Domain** (Optional): If you want to access via a domain name.
3.  **SSH Access**: You should be able to connect to your server via SSH.

## Step 1: Prepare the Server

Connect to your server:
```bash
ssh root@your_server_ip
```

Update the system and install Docker & Docker Compose:
```bash
# Update packages
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Verify installation
docker --version
docker compose version
```

## Step 2: Upload the Application

You can copy the project files to the server using `scp` or `rsync`. Run this command **from your local machine** (not the server):

```bash
# Replace /path/to/project with the actual path to your project folder
# Replace root@your_server_ip with your server's details
rsync -avz --exclude 'node_modules' --exclude '.git' /path/to/law-firm-expense-tracker/ root@your_server_ip:/root/app/
```

Alternatively, you can clone from a git repository if you push your code to GitHub/GitLab.

## Step 3: Deploy

Connect to your server and navigate to the app directory:
```bash
ssh root@your_server_ip
cd /root/app
```

Start the application using Docker Compose:
```bash
docker compose up -d --build
```

## Step 4: Verify

Open your browser and visit: `http://your_server_ip`

You should see the application running.

## Troubleshooting

-   **Check logs**: `docker compose logs -f`
-   **Restart**: `docker compose restart`
-   **Rebuild**: `docker compose up -d --build` (if you changed code)
-   **Database**: The database is stored in `server/database.sqlite`. It is mounted as a volume, so data persists across restarts.

## Security Note

This setup runs on port 80 (HTTP). For production, you should set up SSL (HTTPS).
The easiest way is to use a reverse proxy like **Traefik** or **Nginx Proxy Manager**, or manually configure Certbot with Nginx.
