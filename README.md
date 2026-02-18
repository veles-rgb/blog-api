# Blog API + Frontend

A full-stack blog project for [The Odin Project](https://www.theodinproject.com/).

Built with:

- **Node.js + Express** REST API
- **PostgreSQL + Prisma ORM**
- **JWT authentication with Passport**
- **React frontend (client app)**
- **React editor frontend (author/admin app)**
- **TinyMCE** for rich text editing

The project is split into:

- `server/` → REST API
- `client/` → public blog frontend
- `editor/` → author/admin dashboard

---

## Features

### API
- JWT authentication (login/register)
- Role system (admin / author / user)
- CRUD posts
- Rich text post content (TinyMCE HTML)
- Comments system
- Post likes
- Slug-based post URLs
- Protected routes with Passport JWT

### Client App
- View published posts
- View posts by slug
- Like posts
- Add comments
- Login / register

### Editor App
- Author/admin login
- Create and edit posts with TinyMCE
- Publish / unpublish posts
- Delete posts
- Manage own posts / post comments

---

## Tech Stack

### Backend
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Prisma ORM](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Passport](https://www.passportjs.org/)
- [JWT](https://jwt.io/)

### Frontend
- [React](https://react.dev/)
- [React Router](https://reactrouter.com/)
- [TinyMCE](https://www.tiny.cloud/)

### Deployment
- [Railway](https://railway.app/)
- [Neon Postgres](https://neon.com/)

---
