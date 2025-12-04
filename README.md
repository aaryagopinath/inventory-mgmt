📦 Inventory Management System

A complete Inventory Management System built with a React + Tailwind + shadcn UI frontend and a FastAPI backend.
The system provides essential CRUD operations, smart stock monitoring, and expiry detection to help users manage products effectively.

✨ Features
🛠️ Core Functionalities

Full CRUD operations for managing inventory items

Real-time stock tracking with alerts when items go low or out of stock

Expiry evaluation — Automatically detects whether a product is:

Safe

Expiring soon

Expired

💡 Additional Highlights

Clean REST API architecture using FastAPI

Modern, responsive UI built with:

React

TailwindCSS

shadcn UI

Organized folder structure separating frontend and backend

📁 Folder Structure
inventory-mgmt/
│
├── frontend/          # React + Tailwind + shadcn UI
│   ├── src/
│   ├── public/
│   └── package.json
│
└── backend/           # FastAPI backend
    ├── app/
    ├── requirements.txt
    └── main.py

🚀 Running the Project
1️⃣ Backend — FastAPI

Step 1: Navigate to backend folder

cd backend


Step 2: Create virtual environment (optional)

python -m venv venv
source venv/bin/activate     # Mac/Linux
venv\Scripts\activate        # Windows


Step 3: Install dependencies

pip install -r requirements.txt


Step 4: Start FastAPI server

uvicorn main:app --reload


Backend will run at:
➡️ http://localhost:8000

➡️ Interactive Docs: http://localhost:8000/docs

2️⃣ Frontend — React + Tailwind + shadcn

Step 1: Navigate to frontend

cd frontend


Step 2: Install dependencies

npm install


Step 3: Start development server

npm run dev


Frontend will run at:
➡️ http://localhost:5173
 (Vite default)
or
➡️ http://localhost:3000
 (CRA)
