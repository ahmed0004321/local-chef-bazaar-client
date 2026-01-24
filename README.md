🍳 Local Chef Bazaar
Local Chef Bazaar is a modern full-stack marketplace designed to bridge the gap between talented home chefs and local food lovers. Built with React 19, Vite, and Tailwind CSS, it offers a seamless, high-performance experience for discovering and ordering authentic home-cooked meals.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)
![Vercel](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)

Project Structure
src/
 ├── Auth/           # Firebase logic & Login/Register components
 ├── Components/     # Reusable UI (Buttons, Cards, Spinners)
 ├── Hooks/          # Custom TanStack Query logic
 ├── Pages/          # Main views (Home, Bazaar, Dashboard)
 └── Utils/          # Axios instance and helper functions

🌐 Live Links
Frontend: https://local-chef-bazaar-client.vercel.app/

✨ Features
🔐 Secure Authentication: Integrated with Firebase for Google Social Login.

📊 Interactive Dashboards: Visual data representation using Recharts for chefs to track sales.

🛍️ Dynamic Marketplace: Real-time food listings with optimized searching and filtering.

📱 Premium UI/UX:

Smooth animations with Framer Motion.

Touch-friendly carousels using Swiper.

Modern, responsive components via DaisyUI.

Beautiful notifications with SweetAlert2.

⚡ High Performance: Data fetching and caching powered by TanStack React Query.

🛠️ Tech Stack
Frontend (The Client)
Framework: React 19 (Vite)

State Management: TanStack React Query (Server State)

Styling: Tailwind CSS 4.0 & DaisyUI 5.0

Forms: React Hook Form

Navigation: React Router 7

Animations: Framer Motion & React Confetti

Backend (The Server)
Environment: Node.js

Framework: Express.js

Deployment: Vercel


Package,Purpose
Axios,Handling API requests to the backend.
Firebase,Authentication and real-time services.
Recharts,Rendering data charts for chef analytics.
Lucide React,"Modern, consistent iconography throughout the app."
React Spinners,Elegant loading states for better UX.
Swiper,High-performance sliders for featured dishes.
