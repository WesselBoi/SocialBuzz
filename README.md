# 🌐 SocialBuzz 🚀  
*A modern full-stack social media app built with Next.js & Node.js*

---
## 🌟 Features

- **User Authentication** – Secure registration & login with JWT
- **Social Feed** – Create, view, interact with posts
- **User Profiles** – Personal profiles with post history
- **Search Functionality** – Quickly find users
- **Responsive Design** – Mobile-first layout
- **Dark Theme** – Gradient-based modern UI
- **Real-time Updates** – Seamless content refresh
- **Secure Cookies** – Enhanced security using HttpOnly

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** – App Router enabled React framework  
- **React 18** – Functional components with hooks  
- **Tailwind CSS** – Utility-first CSS  
- **Lucide React** – Icon library  
- **Axios** – For API communication  
- **Vercel** – Frontend deployment  

### Backend
- **Node.js** – JavaScript runtime  
- **Express.js** – Backend routing  
- **MongoDB** – NoSQL database  
- **Mongoose** – MongoDB ODM  
- **JWT** – Auth via JSON Web Tokens  
- **bcrypt** – Password hashing  
- **CORS** – Security for cross-origin requests  
- **Cookie Parser** – HttpOnly cookie middleware  
- **Render** – Backend deployment

---

## 📁 Project Structure

```bash
/socialbuzz
  ├── server/
  │   ├── controllers/
  │   ├── models/
  │   ├── routes/
  │   ├── .env
  │   └── server.js
  └── client/
      ├── components/
      ├── pages/
      ├── styles/
      ├── public/
      └── .env.local
```
---

##  Getting Started

### 🔧 Prerequisites

Make sure you have the following installed:

- **Node.js** (v18+)
- **MongoDB** (local or cloud)
- **Git**

---

### 🔨 Installation

```bash
# Clone the repository
git clone https://github.com/WesselBoi/SocialBuzz
cd socialbuzz
```

---
###⚙️ Backend Setup

```bash
cd backend

# Copy and configure environment variables
cp .env.example .env
# Fill in values like:
# MONGODB_URI=your_mongo_uri
# JWT_SECRET=your_jwt_secret

# Install dependencies and start server
npm install
npm start
```
---
###💻 Frontend Setup

```bash
cd frontend

# Copy and configure environment variables
cp .env.local.example .env.local
# Fill in:
# NEXT_PUBLIC_SERVER_URL=http://localhost:8080

# Install dependencies and run dev server
npm install
npm run dev

```


