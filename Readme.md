# Minecraft Server Manager

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Docker Ready](https://img.shields.io/badge/Docker-Ready-blue)
![Made with NestJS](https://img.shields.io/badge/Backend-NestJS-red)
![Made with Next.js](https://img.shields.io/badge/Frontend-Next.js-black)

A web-based tool for managing multiple Minecraft servers using Docker. Because managing servers from the terminal can be a real headache.

This project is built on top of the amazing work by [itzg](https://github.com/itzg):

- `docker-minecraft-server` – The most popular Minecraft server container
- `docker-mc-backup` – Automated backup system

![Dashboard View](./assets/Animation.gif)

## Why another server manager?

After trying several solutions, I wanted something that was:

- Easy to set up and use
- Modern (no 2000s-era interfaces)
- Flexible for handling multiple servers
- That wouldn't give me headaches

## What you can do

- **Intuitive web panel** - Built with Next.js, no ugly interfaces
- **Robust API** - NestJS backend that handles everything
- **Multiple servers** - Manage as many as your server can handle
- **Real-time logs** - See what's happening without SSH
- **File management** - Edit configurations from your browser
- **Automatic backups** - Because nobody wants to lose their world

## Project structure

```
minecraft-server-manager/
├── frontend/         # The pretty face (Next.js)
├── backend/          # The brain (NestJS)
├── servers/          # Where your servers live
└── filebrowser/      # For manual file handling
```

## Important: Configure your environment variables first

Before running the project, you **must fill in the `.env` file** in the backend folder with your own credentials.

> ⚠️ **Security warning:**
>
> The default admin password hash is:
>
> `$2a$12$/ImficEXuymsxlZap5.92euInslhhQB4Yg/gZS5zusrQ0aanIU2sO`
>
> This is for the user `admin`. **You should change this to your own password hash!**
>
> - Never use the default hash in production.
> - To generate a new hash, use a tool like [bcrypt-generator.com](https://bcrypt-generator.com/) or the `bcrypt` library in Node.js.
> - Example Node.js command:
>
>   ```js
>   require("bcrypt").hashSync("your-new-password", 12);
>   ```
>
> Paste your new hash in the `.env` file.

You need to have installed:

- Docker and Docker Compose
- Node.js (version 18 or higher)
- Git (obviously)
- The desire to manage servers like a pro

## Installation

### Step 1: Download the project

```bash
git clone https://github.com/Ketbome/minecraft-docker-manager.git
cd minecraft-server-manager
```

### Step 2: Set up the backend

```bash
cd backend
npm install
npm run build

# Using PM2 (recommended for production)
pm2 start npm --name "minecraft-backend" -- run start:prod
```

### Step 3: Set up the frontend

```bash
cd ../frontend
npm install
npm run build
pm2 start npm --name "minecraft-frontend" -- run start
```

### Step 4: Save PM2 configuration

```bash
pm2 save
pm2 startup  # Follow the instructions that appear
```

## File browser

Includes Filebrowser for when you need to edit files manually (which always happens).

To start it:

```bash
cd filebrowser
docker-compose up -d
```

Then go to: `http://localhost:25580`

**Default credentials:**

- Username: `admin`
- Password: `admin`

> ⚠️ **Important**: Change these credentials in .env

With Filebrowser you can:

- Browse through your server files
- Edit `server.properties`, `ops.json`, etc.
- Upload mods, plugins, or worlds
- Make quick changes without complications

## Environment variables

### Backend (`.env` file)

```env
FRONTEND_URL=http://localhost:3000
CF_API_KEY=your_curseforge_api_key
CLIENT_PASSWORD=your_super_secret_password
CLIENT_USERNAME=your_username
```

### Frontend (`.env.local` file)

```env
NEXT_PUBLIC_API_URL=http://localhost:8091
```

## What's still missing

- [ ] Translate everything to English (currently in Spanish)
- [ ] Support for more modpack platforms
- [x] Backup system (already done!)
- [ ] User roles and permissions
- [ ] API documentation
- [ ] More detailed deployment guides
- [ ] Improved responsive design

## Roadmap (what's coming)

**Already working:**

- ✅ Basic support for multiple servers
- ✅ Real-time logs
- ✅ User authentication
- ✅ Resource usage dashboard
- ✅ Dynamic server addition/removal

**In the oven:**

- 🔄 Multi-language interface
- 🔄 Mobile design improvements

## Contributing

Found a bug? Have a great idea? Pull requests are welcome!

You can also:

- Report issues in Issues
- Give a star if you like the project
- Share it with other server administrators

## License

MIT License - basically you can do whatever you want with the code.

## Contact

Created by [@Ketbome](https://github.com/Ketbome)

Questions? Suggestions? Just want to chat about Minecraft? Open an issue or send a message.

---

_This project was born out of the frustration of managing Minecraft servers for friends and the community. If it helps you, I'm glad!_
