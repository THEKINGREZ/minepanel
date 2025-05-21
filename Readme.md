# Minecraft Server Manager – Docker-based Minecraft Server Manager

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Docker Ready](https://img.shields.io/badge/Docker-Ready-blue)
![Made with NestJS](https://img.shields.io/badge/Backend-NestJS-red)
![Made with Next.js](https://img.shields.io/badge/Frontend-Next.js-black)

**MinePanel** is a web-based control panel for managing multiple Minecraft servers running with Docker. Inspired by [Crafty Control](https://craftycontrol.com), but fully customizable and built using modern web technologies.

![Dashboard View](./assets/Animation.gif)

---

## 🚀 Features

- Web dashboard built with **Next.js**
- API backend powered by **NestJS**
- Control multiple `docker-compose` Minecraft server instances
- Uses the excellent [`docker-minecraft-server`](https://docker-minecraft-server.readthedocs.io/en/latest/)
- Initial support for two environments: `daily` and `weekend`
- Initial support for two instances: `daily` and `weekend`
- Scalable design to support more Docker containers in the future
- Real-time server status, logs, and controls

---

## 🗂️ Repository Structure

```yaml
minecraft-server-manager/
├── frontend/ # Next.js frontend app
├── backend/ # NestJS backend API
├── daily/ # docker-compose for Minecraft server 1
├── weekend/ # docker-compose for Minecraft server 2
```

---

## ⚙️ Requirements

- Docker + Docker Compose
- Node.js (v18+ recommended)
- Git

---

## 🧑‍💻 Getting Started

```bash
git clone https://github.com/Ketbome/minemanager.git
cd minemanager

# Start the backend
cd backend
npm install
npm run start:dev

# Start the frontend
cd ../frontend
npm install
npm run dev

# Start a Minecraft server
cd ../daily
docker compose up -d
```

📋 ToDo
* <input disabled="" type="checkbox"> Translate the interface to English (currently in Spanish)
* <input disabled="" type="checkbox"> Support more modpack platforms (currently supports CurseForge, Forge, Vanilla)
* <input disabled="" type="checkbox"> Add backup management system
* <input disabled="" type="checkbox"> Implement user roles and permissions
* <input disabled="" type="checkbox"> Add API documentation
* <input disabled="" type="checkbox"> Create deployment guides (Docker, PM2, etc.)

📈 Roadmap
* <input checked="" disabled="" type="checkbox"> Basic support for two Minecraft servers
* <input checked="" disabled="" type="checkbox"> Server logs
* <input checked="" disabled="" type="checkbox"> User authentication
* <input disabled="" type="checkbox"> Resource usage dashboard
* <input disabled="" type="checkbox"> Dynamic addition/removal of server instances
* <input disabled="" type="checkbox"> Support for other games/containers
* <input disabled="" type="checkbox"> Multi-language support (English/Spanish)
* <input disabled="" type="checkbox"> Mobile-responsive design improvements

❓ License
Distributed under the MIT License. See LICENSE for more information.

📬 Contact
Created by @Ketbome — Pull requests, issues, and stars are welcome!
