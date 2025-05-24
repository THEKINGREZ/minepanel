# Minecraft Server Manager – Docker-based Minecraft Server Manager

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Docker Ready](https://img.shields.io/badge/Docker-Ready-blue)
![Made with NestJS](https://img.shields.io/badge/Backend-NestJS-red)
![Made with Next.js](https://img.shields.io/badge/Frontend-Next.js-black)

**Minecraft Docker Manager** is a web-based control panel for managing multiple Minecraft servers running with Docker. Inspired by [Crafty Control](https://craftycontrol.com), but fully customizable and built using modern web technologies.

🧱 Built on top of the excellent projects by itzg:

- `docker-minecraft-server` – Minecraft server container

- `docker-mc-backup` – Automated backup companion container

![Dashboard View](./assets/Animation.gif)

---

## 🚀 Features

- Web dashboard built with **Next.js**
- API backend powered by **NestJS**
- Control multiple `docker-compose` Minecraft server instances
- Uses the excellent [`docker-minecraft-server`](https://github.com/itzg/docker-minecraft-server)
- Initial support for many instances
- Scalable design to support more Docker containers in the future
- Real-time server status, logs, and controls
- 🔧 **Manual file access and editing via Filebrowser**

---

## 🗂️ Repository Structure

```yaml
minecraft-server-manager/
├── frontend/         # Next.js frontend app
├── backend/          # NestJS backend API
├── servers/          # docker-compose for Minecraft servers
├── filebrowser/      # Filebrowser service (manual startup)
```

---

## ⚙️ Requirements

- Docker + Docker Compose
- Node.js (v18+ recommended)
- Git

---

## 🧑‍💻 Getting Started

```bash
git clone https://github.com/Ketbome/minecraft-docker-manager.git
cd minemanager

# Start the backend
cd backend
npm install
npm run build
pm2 start npm --name "backend" -- run start:prod

# Start the frontend
cd ../frontend
npm install
npm run build
pm2 start npm --name "frontend" -- run start

# pm2 save
pm2 save
pm2 startup
```

📂 File Access with Filebrowser

Filebrowser is included for manual inspection and editing of server files through a web interface.

To start Filebrowser:

```bash
cd filebrowser
docker-compose up -d
Then, access it in your browser at:
http://localhost:25580
```
Default credentials:

User: `admin`

Password: `admin`

⚠️ Make sure to change the default credentials after first login.

Filebrowser will allow you to:

Browse individual Minecraft server files

Edit configuration files (e.g., server.properties, ops.json, add mods, etc.)

Upload/download mods, plugins, or world data


## 🔐 Environment Variables

### Backend (.env)

```
FRONTEND_URL= # URL of the frontend application
CF_API_KEY= # CurseForge API key for authentication
CLIENT_PASSWORD= # Password for the client
CLIENT_USERNAME= # Username for the client
```

### Frontend (.env.local)

```
NEXT_PUBLIC_API_URL='localhost:8091' # URL of the backend API
```


📋 ToDo
* [ ] Translate the interface to English (currently in Spanish)
* [ ] Support more modpack platforms (currently supports CurseForge, Forge, Vanilla)
* [X] Add backup management system
* [ ] Implement user roles and permissions
* [ ] Add API documentation
* [ ] Create deployment guides (Docker, PM2, etc.)

📈 Roadmap
* [X] Basic support for two Minecraft servers
* [X] Server logs
* [X] User authentication
* [X] Resource usage dashboard
* [X] Dynamic addition/removal of server instances
* [ ] Support for other games/containers
* [ ] Multi-language support (English/Spanish)
* [ ] Mobile-responsive design improvements

❓ License
Distributed under the MIT License. See LICENSE for more information.

📬 Contact
Created by [@Ketbome](https://github.com/Ketbome) — Pull requests, issues, and stars are welcome!
