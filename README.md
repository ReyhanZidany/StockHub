<div align="center">
  <img src="public/stockhub.png" alt="StockHub Logo" width="120" height="auto" />
  <h1>StockHub</h1>
  
  <p>
    <strong> Inventory & Stock Management System (ERP)</strong>
  </p>
  

  ![Ruby](https://img.shields.io/badge/Ruby-3.x-CC342D?style=flat&logo=ruby&logoColor=white)
  ![Rails](https://img.shields.io/badge/Rails-8.x-CC0000?style=flat&logo=rubyonrails&logoColor=white)
  ![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react&logoColor=black)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat&logo=postgresql&logoColor=white)
</div>

<br />

**StockHub** is a comprehensive **Inventory & Stock Management System (ERP)** designed to demonstrate real-world enterprise architecture. It bridges a robust **Ruby on Rails** backend with **React**.

The project emphasizes **clean domain logic**, service-oriented architecture, and a seamless scalable frontend-backend separation standard in modern web development.

---

## ✨ Features

### 🏗 Backend (Ruby on Rails API)
* **RESTful Architecture:** Clean and predictable API endpoints.
* **Secure Authentication:** JWT-based stateless authentication.
* **Inventory Service Layer:** encapsulated logic for complex stock movements (`Inventory::Manager`).
* **Stock Operations:**
    * ➕ **Add Stock:** Inbound inventory processing.
    * ➖ **Reduce Stock:** Outbound/Sales processing.
    * ♻️ **Adjust Stock:** Stocktake and correction handling.
* **Database:** Optimized PostgreSQL schema with proper indexing.
* **CORS Configuration:** Ready for secure cross-origin requests.

### 🎨 Frontend (React Client)
* **Modern Tooling:** Built with React 18 and Vite for lightning-fast HMR.
* **ERP UI/UX:** Styled with Tailwind CSS for a professional, responsive enterprise look.
* **Dashboard:** Real-time overview of total products, stock levels, and low-stock alerts.
* **Visualizations:** Interactive charts using Recharts.
* **Interactive Modals:** Streamlined user experience for stock adjustments.
* **Component Architecture:** Reusable, typed, and clean UI components.

---

## 🖥 Tech Stack

| Component | Technology | Description |
| :--- | :--- | :--- |
| **Backend Framework** | **Ruby on Rails 8** | API Mode |
| **Language** | **Ruby 3.x** | Core logic |
| **Database** | **PostgreSQL** | Relational Data Store |
| **Authentication** | **JWT** | JSON Web Tokens |
| **Frontend Framework** | **React 18** | UI Library |
| **Build Tool** | **Vite** | Bundler & Dev Server |
| **Styling** | **Tailwind CSS** | Utility-first CSS |
| **Icons** | **Lucide React** | Modern SVG Icons |
| **HTTP Client** | **Fetch API** | Native async requests |

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
* **Ruby** (v3.0+)
* **Node.js** (v18+) & **npm**
* **PostgreSQL** (Running locally)

### 1. Backend Setup (Rails)

Navigate to the backend directory:

```bash
cd backend
