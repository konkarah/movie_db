
# 🎬 CineScope – Movie Recommendation App

A responsive movie recommendation platform built with **Next.js** and **Tailwind CSS**, featuring secure authentication with **Clerk**, dynamic movie listings, and personalized user features.

[Live Demo](https://cinescope-md.vercel.app/) | [GitHub Repo](https://github.com/Emmanuel687/Next.js-Movies-Recommendation.git) | [Author](https://www.linkedin.com/in/emmanuel-koech-79368b21a/)

---

## 🛠️ Tech Stack

- **Next.js** – React-based framework for fast and scalable web apps.  
- **Tailwind CSS** – Utility-first CSS framework for modern styling.  
- **Clerk** – Authentication and user management (login, sign-up, profiles).  
- **MongoDB & Mongoose** – Database management for user and movie data.  
- **TMDB API** – Movie data provider (titles, posters, ratings, trailers).  
- **Vercel** – Deployment platform with CI/CD integration.  

---

## ✨ Features

### 🔑 Authentication & Profiles
- Secure login/sign-up via **Clerk**  
- Personalized user profiles  
- Protected routes for authenticated features  

### 🎥 Movie Browsing
- Dynamic movie listings with posters, trailers, descriptions, ratings, and reviews  
- Search movies by title
- Responsive grid layout for desktop and mobile  
-Top-rated and trending movie sections
-Detailed movie pages with cast information and reviews



### ⭐ Personalization
- Add/remove movies from a personal watchlist  
- View Other Similar Movies   
- Favorite movies collection with easy access



### 🌙 User Experience
- Dark mode toggle for a sleek, modern look
- Smooth animations and transitions
- Loading states and error handling
- Responsive design for all screen sizes



<img width="1920" height="993" alt="ScreenShot Tool -20250919004946" src="https://github.com/user-attachments/assets/78413850-1763-404c-9cfb-1e8aabee10f7" />

<img width="1920" height="993" alt="ScreenShot Tool -20250919005105 (1)" src="https://github.com/user-attachments/assets/99c99454-531d-4eb8-8986-4ad4ff6a1309" />

<img width="1920" height="993" alt="ScreenShot Tool -20250919005230" src="https://github.com/user-attachments/assets/60d58c6a-4bb1-41da-a4dc-cda3a2f0ad37" />

<img width="1920" height="993" alt="ScreenShot Tool -20250919005353" src="https://github.com/user-attachments/assets/6222c581-efef-471e-9004-b65126ee210e" />

<img width="1920" height="993" alt="ScreenShot Tool -20250919005453" src="https://github.com/user-attachments/assets/3496099e-c13a-4e76-b18a-e04da16bd104" />

<img width="1920" height="993" alt="ScreenShot Tool -20250919005030" src="https://github.com/user-attachments/assets/a455917e-8f51-4e9c-901c-791b05dcb86d" />

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/Emmanuel687/Next.js-Movies-Recommendation.git
cd Next.js-Movies-Recommendation

### 2️⃣ Install Dependencies
npm install

### 3️⃣ Configure Environment Variables

### Configure Environment Variables
Create a .env.local file in the root and add:

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
CLERK_WEBHOOK_SIGNING_SECRET=your_webhook_secret

# Database
MONGODB_URI=your_mongodb_connection_string

# TMDB API
NEXT_PUBLIC_API_KEY=your_tmdb_api_key


4️⃣ Run Development Server
npm run dev


Open http://localhost:3000
 to view the app.

✅ Scripts

npm run dev – Start the development server

npm run build – Build the app for production

npm run start – Start the production server

npm run lint – Run ESLint checks

npm run test – Run all Vitest tests

npm run test:watch – Watch mode for tests

🧪 Testing & CI/CD

Testing: All components and actions are tested using Vitest. Run tests with:

npm run test

Test Coverage
Component tests for UI elements

API service tests for TMDB integration

Authentication flow tests

User interaction tests


CI/CD: GitHub Actions automatically runs linting and tests on every push or pull request to main.

If checks pass, the app is automatically deployed to Vercel.

📦 Deployment

The project is deployed on Vercel && AWS:

Automatic CI/CD pipeline runs linting and unit tests on every push or pull request to main.

Once checks pass, the project is deployed to production.

🚀 CD (Continuous Deployment):

If all checks pass, the app is automatically deployed to Vercel.

Vercel handles the production deployment based on the latest main branch.

🌐 Live Deployments

Vercel (Production): https://cinescope-md.vercel.app/

AWS Amplify (Alternate Hosting): https://main.dy5bt2m6cp7h7.amplifyapp.com/

🔧 Configuration
Clerk Setup
Create a Clerk account at clerk.dev

Create a new application

Copy API keys to environment variables

MongoDB Setup
Create a MongoDB Atlas account or use local MongoDB

Create a new database and collection

Update connection string in environment variables

TMDB API Setup
Register at The Movie Database

Generate API key from account settings

Add API key to environment variables

