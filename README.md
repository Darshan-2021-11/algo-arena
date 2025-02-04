# Algo Arena

Algo Arena is an interactive platform designed for algorithm enthusiasts to practice, compete, and improve their coding skills. The platform offers a wide range of algorithm challenges, from basic to advanced levels, allowing users to solve problems and compete in duels.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction

Welcome to Algo Arena! This platform is designed to help you improve your algorithmic problem-solving skills. Whether you're preparing for coding interviews, participating in coding competitions, or just want to sharpen your skills, Algo Arena offers a variety of challenges to suit your needs.

## Features

- **Wide Range of Challenges**: From simple sorting algorithms to complex graph problems.
- **Duet System**: Two players compete against each other within a set time limit to solve algorithm challenges.
- **Real-Time Feedback**: Get instant feedback on your code with our automated testing system.

## Installation

To get started with Algo Arena, follow these steps:

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/Darshan-2021-11/algo-arena.git
    ```
2. **Navigate to the Project Directory**:
    ```bash
    cd algo-arena
    ```

3. **Backend Setup**:
    - Navigate to the server directory:
      ```bash
      cd server
      ```
    - Create a `.env` file in the server directory with the following variables:
      ```env
      PORT=your_backend_port
      ORIGIN=your_origin
      ```
    - Install dependencies and run the backend server:
      ```bash
      npm install
      npm start
      ```

4. **Frontend Setup**:
    - Navigate to the frontend directory:
      ```bash
      cd frontend
      ```
    - Create a `.env` file in the frontend directory with the following variables:
      ```env
      NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
      NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
      NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
      NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
      NEXT_PUBLIC_SOCKET_URL=your_socket_url
      ```
    - Install dependencies and run the frontend server:
      ```bash
      npm install
      npm run dev
      ```

5. **Docker Setup for Judge0**:
    - Ensure you have Docker installed and running on your machine.
    - Build and run the Judge0 API container:
      ```bash
      docker-compose up --build
      ```

## Usage

1. **Sign Up / Log In**: Create an account or log in to access all features.
2. **Browse Challenges**: Explore the list of available challenges and select one to solve.
3. **Duet System**: Challenge a friend or another user to a duel and solve the algorithm within the set time limit.
4. **Submit Solutions**: Write and submit your code. The system will automatically test and score your solution.

## Contributing

We welcome contributions from the community! To contribute to Algo Arena, please follow these steps:

1. **Fork the Repository**: Click the "Fork" button at the top of the repository page.
2. **Clone Your Fork**:
    ```bash
    git clone https://github.com/Darshan-2021-11/algo-arena.git
    ```
3. **Create a New Branch**:
    ```bash
    git checkout -b feature/your-feature-name
    ```
4. **Make Your Changes**: Implement your feature or fix the bug.
5. **Commit Your Changes**:
    ```bash
    git commit -m "Add new feature/fix bug"
    ```
6. **Push to Your Fork**:
    ```bash
    git push origin feature/your-feature-name
    ```
7. **Create a Pull Request**: Open a pull request to the main repository.

## License

This project is licensed under the Apache 2.0 License.

## Contact

If you have any questions, suggestions, or feedback, feel free to reach out any of these emails:

- **some-coder-whowantstocode**: [someprogrammerwhowantstocode](mailto:someprogrammerwhowantstocode@gmail.com)
- **Darshan-2021-11**: [darshanrajpattanaik3](mailto:darshanrajpattanaik3@gmail.com)
- **Nishantdas77**: [dasnishant7777](mailto:dasnishant7777@gmail.com)
- **flyingfist7**: [bradhawk718](mailto:bradhawk718@gmail.com)
- **supriyo23d**: [supriyodhali048](mailto:supriyodhali048@gmail.com)
- **GitHub Issues**: [Create a new issue](https://github.com/Darshan-2021-11/algo-arena/issues)
