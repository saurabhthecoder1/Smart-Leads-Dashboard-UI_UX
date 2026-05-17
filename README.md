# 📊 Smart Leads Dashboard (UI/UX)

A modern, responsive **Lead Management Dashboard UI** built using **React (Vite), TypeScript, Tailwind CSS**, and a rich set of reusable UI components.  
This project focuses on clean UI/UX design, modular architecture, and scalable frontend development practices.

---

## 🚀 Features

- 📌 Lead management dashboard UI
- 📊 Data visualization using charts (Recharts)
- 🧩 Modular and reusable component architecture
- 🎨 Modern UI built with Radix UI + Tailwind CSS
- ⚡ Fast development setup using Vite
- 📱 Fully responsive design (desktop, tablet, mobile)
- 🧭 Sidebar-based navigation layout
- 🧾 Form handling and structured UI inputs
- 🌙 Theme-ready architecture (light/dark support compatible)

---

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript  
- **Build Tool:** Vite  
- **Styling:** Tailwind CSS, Tailwind Merge, Class Variance Authority  
- **UI Components:** Radix UI, shadcn-style components  
- **Icons:** Lucide React, MUI Icons  
- **Charts:** Recharts  
- **Forms:** React Hook Form  
- **Routing:** React Router  
- **Animations:** Motion  
- **Utilities:** date-fns, clsx, sonner  

---

## 📁 Project Structure

```bash
smart-leads-dashboard/
│
├── public/                         # Static assets
│
├── src/
│   ├── assets/                     # Images, icons, and media files
│   ├── components/                 # Reusable components
│   │   ├── ui/                     # Buttons, cards, modals, forms
│   │   ├── dashboard/              # Dashboard widgets and charts
│   │   ├── layout/                 # Sidebar, navbar, headers
│   │   └── common/                 # Shared utilities/components
│   │
│   ├── pages/                      # Main application screens
│   │   ├── Dashboard.tsx
│   │   ├── Leads.tsx
│   │   ├── LeadDetails.tsx
│   │   ├── Settings.tsx
│   │   └── Help.tsx
│   │
│   ├── hooks/                      # Custom hooks
│   ├── context/                    # State management/context API
│   ├── services/                   # API integrations/backend logic
│   ├── utils/                      # Helper functions
│   ├── styles/                     # Global styles/themes
│   ├── App.tsx                     # Root component
│   └── main.tsx                    # Entry point
│
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── vite.config.ts                  # Vite build configuration
└── README.md                       # Project documentation
