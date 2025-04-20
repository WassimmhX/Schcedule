# ISIM Planning System

A modern, comprehensive web application for managing and visualizing academic schedules and planning at ISIM (Institut Supérieur d'Informatique et de Mathématiques). This system streamlines administrative workflows, enhances educational resource allocation, and provides intelligent scheduling solutions.


[![FastAPI](https://img.shields.io/badge/FastAPI-0.110.0-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18.0.0-61DAFB.svg)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4.6.1-47A248.svg)](https://www.mongodb.com/)
[![Python](https://img.shields.io/badge/Python-3.12-3776AB.svg)](https://www.python.org/)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Development](#-development)
- [Available Scripts](#-available-scripts)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)
- [Support](#-support)

## ✨ Features

### Core Functionality
- **Interactive Calendar Interface**: Visualize schedules with drag-and-drop capabilities using FullCalendar
- **Advanced Data Visualization**: Comprehensive view of scheduling data with DataTables
- **Document Generation**: Export schedules and reports to PDF format
- **Multi-user Access Control**: Role-based permissions system for administrators, professors, and students
- **Resource Management**: Track and allocate classrooms, labs, and equipment

### User Experience
- **Responsive Design**: Seamless experience across all devices with Tailwind CSS
- **Real-time Updates**: Instant synchronization of schedule changes
- **Intuitive Interface**: User-friendly dashboard with toast notifications
- **Personalized Views**: Customizable layouts for different user roles

### Integration & Automation
- **Email Notification System**: Automated alerts for schedule changes and updates
- **AI-powered Assistance**: LangChain integration for intelligent scheduling recommendations
- **AI Assistant Agent**: Natural language interface for answering schedule-related questions
- **Data Import/Export**: Seamless integration with existing educational management systems

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Hooks and Context API
- **Build Tool**: Vite for faster development and optimized production builds
- **Styling**: Tailwind CSS with custom theming
- **Routing**: React Router DOM v6
- **State Management**: React Query for server state, Zustand for client state
- **UI Components**:
  - FullCalendar for schedule visualization
  - DataTables for data representation
  - React PDF for document generation
  - React-Toastify for notifications
  - Headless UI for accessible components

### Backend
- **API Framework**: FastAPI 0.110.0
- **Server**: Uvicorn 0.29.0 (ASGI)
- **Database**: MongoDB with PyMongo 4.6.1
- **Authentication**: JWT with bcrypt password hashing
- **Data Processing**:
  - Pandas 2.2.2 for data manipulation
  - NumPy 1.26.4 for numerical operations
- **AI Integration**:
  - LangChain 0.1.14 for AI-powered features
  - Ollama for local model deployment
- **Email**: FastAPI-Mail 1.4.1
- **Validation**: Pydantic 2.6.4

### DevOps
- **CI/CD**: GitHub Actions

## 🏗️ Architecture

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│             │       │             │       │             │
│  Frontend   │◄─────►│   Backend   │◄─────►│  Database   │
│  (React)    │       │  (FastAPI)  │       │  (MongoDB)  │
│             │       │             │       │             │
└─────────────┘       └──────┬──────┘       └─────────────┘
                             │
                     ┌───────▼───────┐
                     │               │
                     │  AI Services  │
                     │  (LangChain)  │
                     │               │
                     └───────────────┘
```

## 📋 Prerequisites

- **Node.js**: v16.0.0 or higher
- **Python**: 3.12 or higher
- **Package Manager**: npm (v8+) or yarn (v1.22+)
- **Database**: MongoDB (v5+)
- **AI Model**: Ollama (for AI features)
- **Git**: For version control

## 🚀 Installation

### 1. Clone the repository:
```bash
git clone https://github.com/WassimmhX/Schedule
cd Schedule
```

### 2. Install frontend dependencies:
```bash
# Using npm
npm install
```

### 3. Set up the backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### 4. Set up environment variables:
Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URL=your_mongodb_connection_string
BD_NAME=name_of_your_database

MAIL_USERNAME=your_email
MAIL_PASSWORD=your_email_password
MAIL_FROM=your_from_email
MAIL_SERVER=your_smtp_server
```

## 💻 Development

### Starting development servers:

```bash
# Start both frontend and backend concurrently
npm run dev
```

This will start the following services:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5000


## 📜 Available Scripts

- `npm run dev` - Start development servers (frontend and backend)
- `npm run build` - Build frontend for production
- `npm run preview` - Preview production build locally
- `npm run format` - Format code with Prettier

## 📁 Project Structure

```
Schedule/
├── src/              # Frontend source code
├── backend/          # Backend source code
│   ├── main.py      # FastAPI application
│   ├── models/      # Database models
│   ├── routes/      # API routes
│   ├── services/    # Business logic
│   ├── agents/      # AI agents and assistants
│   └── utils/       # Utility functions
├── public/           # Static assets
├── node_modules/     # Frontend dependencies
├── package.json      # Frontend dependencies and scripts
└── vite.config.js    # Vite configuration
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Open an [issue](https://github.com/username/ISIM-Planning-System/issues)
- Contact the development team at wmaharsia@gmail.com or ahmedmtawahg@gmail.com
---

Developed with ❤️ by WassimmhX & AhmedMetaoua