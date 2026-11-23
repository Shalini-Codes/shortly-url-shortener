# Shortly 🔗
### URL Shortener & Analytics Dashboard

https://shortly-frontend-hop9.onrender.com

Shortly is a full-stack web application that converts long URLs into short, shareable links and tracks link engagement through click analytics.

## ✨ Features

- **User Authentication** – Sign up and log in to your account.
- **URL Shortening** – Convert long URLs into short links.
- **Instant Redirection** – Redirect users from short links to their original URLs.
- **Click Analytics** – Track clicks on shortened links.
- **Dashboard** – Manage and monitor your shortened URLs.
- **Link Management** – View and manage created links.
- **Responsive Interface** – User-friendly interface for easy navigation.
- **Live Deployment** – Deployed frontend and backend.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend UI |
| Vite | Frontend development and build tool |
| Tailwind CSS | Styling |
| Node.js | Backend runtime |
| Express.js | Backend API |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB object modeling |
| JWT | Authentication |
| Git & GitHub | Version control |
| Render | Deployment |

## ⚙️ How It Works

1. Create an account or log in.
2. Enter a long URL in the dashboard.
3. Shortly generates a shortened URL.
4. Copy and share the generated link.
5. When someone clicks the short URL, they are redirected to the original destination.
6. Click activity is recorded and reflected in the analytics dashboard.

## 🏗️ Architecture

```text
                 ┌────────────────────┐
                 │       User        │
                 └─────────┬────────┘
                           │
                           ▼
                 ┌────────────────────┐
                 │ React Frontend    │
                 │   (Vite)          │
                 └─────────┬────────┘
                           │ REST API
                           ▼
                 ┌────────────────────┐
                 │ Node.js + Express  │
                 │    Backend        │
                 └─────────┬────────┘
                           │
                           ▼
                 ┌────────────────────┐
                 │   MongoDB Atlas    │
                 │   Database         │
                 └────────────────────┘
```

## 📂 Project Structure

```text
Shortly/
│
├── frontend/          # React frontend
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/           # Node.js & Express backend
│   ├── src/
│   ├── routes/
│   ├── models/
│   └── package.json
│
└── README.md
```

*Folder structure may vary depending on the implementation.*

## 🚀 Live Deployment

- **Frontend:** [Open Shortly](ADD_YOUR_FRONTEND_URL)
- **Backend:** [Backend API](https://shortly-url-shortener-cn6m.onrender.com)

## 💻 Run Locally

### Prerequisites

- Node.js
- npm
- MongoDB connection string

### 1. Clone the Repository

```bash
git clone YOUR_REPOSITORY_URL
cd URL-shortener
```

### 2. Setup Backend

```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Start the backend server:

```bash
npm start
```

### 3. Setup Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend folder:

```env
VITE_API_URL=http://localhost:5000/api
VITE_PUBLIC_BASE_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB database connection string |
| `JWT_SECRET` | Secret key used for authentication |
| `PORT` | Backend server port |
| `VITE_API_URL` | Backend API URL used by the frontend |
| `VITE_PUBLIC_BASE_URL` | Base URL for generated short links |

**Never commit your `.env` file or expose your database credentials.**

## 🧪 Testing

The deployed application was manually tested for the following functionalities:

- User signup
- User login
- Dashboard access
- URL shortening
- Short URL redirection
- Click count tracking

## 🔮 Future Enhancements

- QR code generation
- Custom short URL aliases
- Link expiration
- Advanced analytics and visualizations
- URL categorization
- Improved dashboard insights

## 👩‍💻 About the Project

Shortly was developed as a full-stack web development project to explore frontend and backend integration, REST APIs, authentication, database management, URL redirection, analytics, and cloud deployment.

---

⭐ **Shortly — Make long links short and simple.**

