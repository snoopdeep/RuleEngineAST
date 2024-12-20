# Rule Engine Application

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
  - [Starting the Backend Server](#starting-the-backend-server)
  - [Starting the Frontend Server](#starting-the-frontend-server)
- - [Starting with Docker](#starting-with-Docker)
- [Contact](#contact)

---

## Introduction

The **Rule Engine Application** is a full-stack web application that enables dynamic creation, management, and evaluation of business rules. Users can define rules through a user-friendly interface, which are then processed by a backend engine in real time.

---

## Features

- **Dynamic Rule Creation**: Create complex business rules with an intuitive UI.
- **Real-time Evaluation**: Process and evaluate rules in real-time.
- **Visual Workflow**: Visualize rule workflows using `react-flow-renderer`.
- **Persistent Storage**: Store rules and data in MongoDB for durability.

---

## Architecture

The application uses a **Client-Server** architecture:

- **Frontend**: Built with React.js to provide a responsive and interactive user interface.
- **Backend**: Developed using Node.js and Express.js, handling API requests and business logic.
- **Database**: MongoDB for data persistence, offering flexibility for dynamic rule definitions.

---

## Prerequisites

Make sure you have the following software installed:

- **Node.js** (v20.x or later)
- **npm** (v6.x or later)
- **MongoDB** (v4.x or later)
- **Git**

---

## Installation

### Backend Setup

1. **Clone the Repository**

    ```bash
    git clone https://github.com/snoopdeep/RuleEngineAST.git
    ```
    ```bash
    cd RuleEngineAST/backend
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Configure Environment Variables**

    In `.env` file of the `backend` directory, add your MongoDB connection URL:

    ```bash
    MONGODB_URI=your_mongodb_connection_string
    ```


### Frontend Setup

1. **Navigate to the Frontend Directory**

    ```bash
    cd ../frontend
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

---

## Running the Application

### Starting the Backend Server

From the `backend` directory, run:

```bash
npm start
```

This will start the backend server on ```http://localhost:5000``` (default port can be configured).


### Starting the Frontend Server

From the `frontend` directory, run:
```bash
num start
```
This will start the frontend development server on ```http://localhost:3000```.

---

Starting with Docker
-----
I assume you have installed Docker and it is running.

See the [Docker website](http://www.docker.io/gettingstarted/#h_installation) for installation instructions.

**Environment Variables:** Ensure .env variables (e.g., MONGODB_URI) are configured correctly in backend/.env.


Build
-----
Run the following command to build and start the containers:
```bash
docker-compose up --build
```

Once everything has started up, you should be able to access the webapp via [http://localhost:3000/](http://localhost:3000/) on your host machine.
```bash
http://localhost:3000/
```

To stop the services, use:

```bash
docker-compose down
```

# Contact Information

If you have any questions or would like to reach out, feel free to contact me via the following channels:

- **Email**: [singhdeepak.bengaluru7@gmail.com](mailto:singhdeepak.bengaluru7@gmail.com)
- **Phone No**: [+91 9170520433](9170520433)

