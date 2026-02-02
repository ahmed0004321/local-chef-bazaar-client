# Local Chef Bazaar 🍳 - Professional Marketplace Client

A modern, high-performance full-stack marketplace designed to bridge the gap between talented local chefs and food lovers. This repository contains the **Frontend (Client)** implementation.

## ✨ Key Features

### 👨‍💻 Multi-Role Dashboard
- **Admin Console**: Professional analytics with interactive Recharts, user management (fraud detection), and chef request handling with glassmorphism UI.
- **Chef Console**: Culinary management system to create, update, and track meal performance and order requests.
- **Customer Zone**: Seamless ordering flow with high-fidelity filtering, sorting, and Stripe-integrated payments.

### 📊 Advanced Analytics
- **Revenue Trajectory**: Interactive SVG-glowing growth charts with natural curves.
- **Platform Health**: Real-time tracking of Today's Sales, Platform Profit (20% fee logic), and User Ecosystem distribution.

### 🛍️ Premium UX/UI
- **Glassmorphism Design**: Modern, sleek aesthetics with backdrop blurs and subtle glows throughout the admin and chef dashboards.
- **Responsive Layout**: Fully optimized for mobile, tablet, and desktop viewing.
- **Smart Redirection**: Role-based landing pages for instant access to relevant tools.

## 🛠️ Tech Stack

- **Framework**: React.js (v19)
- **Styling**: Tailwind CSS (Premium Glassmorphism Theme)
- **Data Fetching**: React Query (TanStack Query) for efficient caching and synchronization.
- **State Management**: Context API (AuthContext)
- **Routing**: React Router (v7) with role-based navigation.
- **Charts**: Recharts for interactive data visualization.
- **Authentication**: Firebase Authentication.
- **Payments**: Stripe Integration.
- **Icons**: React Icons (Fa / Io).

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/ahmed0004321/local-chef-bazaar-client.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Create a `.env` file with your Firebase and Stripe keys.

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 📐 Architecture

The project follows a component-driven architecture with a strong focus on reusability:
- `/src/Components/UI`: Base design system (Buttons, Cards, Inputs).
- `/src/Dashboard`: Complex role-specific modules.
- `/src/Hooks`: Custom logic for API security and state.
- `/src/Routes`: Secure, role-protected navigation mesh.

---
Built with ❤️ by [Oasif Ahmed](https://github.com/ahmed0004321)
