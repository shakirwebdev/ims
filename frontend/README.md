# React Frontend

This is the React frontend for the IMS application.

## Setup

The frontend is automatically configured when running with Docker.

## Features

- React 18
- Axios for API calls
- Connected to Laravel backend

## Manual Setup (without Docker)

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
REACT_APP_API_URL=http://localhost:8000/api
```

3. Start the development server:
```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)
