# 📘 Today I Learned (TIL)

A Vue 3 + Vite application that helps you **track what you learned on specific days**.  
Add **subjects**, and log daily learnings on a **calendar view**.  
A lightweight and simple tool to build your own digital learning diary. 🧠📅

---

## 🚀 Features

- ✅ Add and manage learning subjects
- 📅 View what you learned each day
- 🖥️ Built with Vue 3 + Vite
- 🔧 Mock backend with `json-server`

---

## 🛠️ Tech Stack

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Vue Router](https://router.vuejs.org/)
- [Day.js](https://day.js.org/) for date handling
- [json-server](https://github.com/typicode/json-server) for mock API

---

## 📦 Project Setup

## Run without docker

### 1. 🔧 Install Dependencies

    npm install

### 2. 💻 Start in Development Mode (with hot reload + mock backend)

    npm run dev

        Frontend: http://localhost:5173

        API Server: http://localhost:3000

        Make sure ports 5173 and 3000 are free.

### 3. 🏗️ Build for Production

    npm run build

Then preview the built app locally with:

    npm run preview

## 🐳 Run with Docker

Build the Docker image:

    docker build -t til-app .

Run the container:

    docker run -p 5173:5173 -p 3000:3000 til-app

        Visit the app: http://localhost:5173

        Visit the API: http://localhost:3000

    Vite is configured to run on 0.0.0.0 so it's accessible outside the container.

### 💡 Recommended IDE Setup

    Visual Studio Code

    Volar (disable Vetur)

### 🔗 Vite Configuration Reference

See the full config docs here: vitejs.dev/config
✍️ License

MIT – feel free to use, modify, and build upon this project.
