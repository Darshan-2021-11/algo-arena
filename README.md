# Algo Arena

Algo Arena is an interactive platform designed for algorithm enthusiasts to practice, compete, and improve their coding skills. The platform offers a wide range of algorithm challenges, from basic to advanced levels, allowing users to solve problems and compete in duels.

## Table of Contents
- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Features](#features)
- [Installation (Docker)](#installation-docker)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Introduction
Welcome to Algo Arena! This platform is designed to help you improve your algorithmic problem-solving skills. Whether you're preparing for coding interviews, participating in coding competitions, or just want to sharpen your skills, Algo Arena offers a variety of challenges to suit your needs.

## Project Structure
```
./
├── client/        # Next.js frontend
├── server/        # Node.js/Express backend
├── judge0/        # Judge0 code execution engine (with its own docker-compose.yml)
├── docker-compose.yml  # Main orchestrator for all services
└── README.md
```

## Features
- **Wide Range of Challenges**: From simple sorting algorithms to complex graph problems.
- **Duet System**: Two players compete against each other within a set time limit to solve algorithm challenges.
- **Real-Time Feedback**: Get instant feedback on your code with our automated testing system.
- **Contests & Leaderboards**: Participate in contests and view rankings.
- **Admin Panel**: Manage problems, contests, and users.

## Installation (Docker)

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running (Windows, Mac, or Linux)

### 1. Clone the Repository
```powershell
git clone https://github.com/Darshan-2021-11/algo-arena.git
cd algo-arena
```

### 2. Environment Variables
- Create a `.env` file in both `client/` and `server/` as needed for your environment (see sample `.env.example` if available).
- For most local development, defaults will work, but you may want to set up Firebase keys and other secrets.

### 3. Start All Services (Recommended)
This will start the frontend, backend, MongoDB, Redis, and Judge0 (if you want to use the public Judge0 image):
```powershell
docker compose up --build
```
- The client will be available at [http://localhost:3000](http://localhost:3000)
- The server will be available at [http://localhost:5000](http://localhost:5000)
- Judge0 API will be available at [http://localhost:2358](http://localhost:2358)
- MongoDB and Redis are available internally to the containers

#### If you want to use your own Judge0 stack
- Go to the `judge0/` directory and run:
  ```powershell
  cd judge0
  docker compose up -d
  ```
- Remove or comment out the `judge0` service in the main `docker-compose.yml`.
- Make sure your backend is configured to use the correct Judge0 API URL (e.g., `JUDGE0_URL=http://localhost:2358`).

### 4. Manual (Non-Docker) Setup (Advanced)
If you want to run services manually:
- Start MongoDB and Redis locally (or use Docker for just these services)
- In `server/` and `client/`, run:
  ```powershell
  npm install
  npm run build
  npm start # or npm run dev for client
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

## Contribution Guidelines

Welcome to the **AlgoArena** project! We're excited to have you on board. To ensure smooth collaboration and maintain high standards, please follow these guidelines:

### Code Formatting
- **Prettier**:
  - Use Prettier for consistent code formatting across the project.
  - Set up Prettier to run on every commit using a pre-commit hook (e.g., Husky).
- **ESLint**:
  - Use ESLint to identify and fix problematic patterns in your code.
  - Extend ESLint configuration with Airbnb or other industry-standard style guides.
  - Enable TypeScript-specific ESLint rules using `@typescript-eslint`.
- **Indentation**:
  - Use 2 spaces for indentation in JavaScript/TypeScript, HTML, and CSS files.
  - Configure editors to enforce the indentation style.

### Naming Conventions
- **Variables and Functions**:
  - Use **camelCase** for variable names and function names (e.g., `fetchUserData`).
- **Classes and Components**:
  - Use **PascalCase** for class names and React component names (e.g., `UserProfile`).
- **Constants**:
  - Use **UPPER_SNAKE_CASE** for constant values (e.g., `MAX_USER_COUNT`).

### Code Comments
- **General Comments**:
  - Write clear, concise, and meaningful comments for complex logic and important sections of the code.
- **Function Documentation**:
  - Use JSDoc or TypeScript to document functions, including descriptions, parameters, and return types.

```typescript
/**
 * Fetches user data from the API.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<User>} The user data.
 */
async function fetchUserData(userId: string): Promise<User> {
  // Function implementation
}
```

### File and Folder Structure
- Follow the proposed folder structure for clear separation of concerns.
- Group related files together (e.g., a component’s styles, tests, and related files).

### Git and Version Control
- **Branching Strategy**:
  - Use a branching strategy such as GitFlow or GitHub Flow.
  - Create separate branches for features, bug fixes, and hotfixes.
- **Commit Messages**:
  - Write descriptive commit messages following a standard format (e.g., Conventional Commits).
  - Example: `feat(auth): add user login functionality`
- **Code Reviews**:
  - Conduct thorough code reviews before merging to the main branch.
  - Use tools like GitHub Pull Requests for code reviews and discussions.

### Code Quality
- **Unit Testing**:
  - Write unit tests for critical functions and components.
  - Use testing frameworks like Jest and React Testing Library.
- **Integration Testing**:
  - Write integration tests to verify the interaction between different parts of the application.
- **Static Code Analysis**:
  - Use tools like SonarQube for static code analysis to identify code smells and security vulnerabilities.

### Best Practices
- **SOLID Principles**:
  - Follow SOLID principles for object-oriented programming and design.
- **DRY and KISS**:
  - Avoid code duplication (DRY - Don’t Repeat Yourself) and keep code simple and straightforward (KISS - Keep It Simple, Stupid).
- **Type Safety**:
  - Use TypeScript to enforce type safety and catch errors at compile time.
  - Avoid using `any` type; always specify explicit types.

### Environment Configuration
- **Environment Variables**:
  - Store environment-specific settings in `.env` files.
- **Security**:
  - Never commit sensitive information (e.g., API keys, passwords) to version control.
  - Use secrets management tools like AWS Secrets Manager or Azure Key Vault.

### Code Reviews
- **Constructive Feedback**:
  - Provide constructive feedback during code reviews.
  - Focus on code quality, readability, and adherence to coding standards.
- **Knowledge Sharing**:
  - Encourage knowledge sharing and mentorship within the team.
  - Discuss best practices and architectural decisions during code reviews.

### Communication
- **Team Communication**:
  - Use communication tools like Slack or Microsoft Teams for quick discussions and updates.
  - Conduct regular stand-up meetings to track progress and address any blockers.

Thank you for contributing to AlgoArena! Let's build something amazing together. 🚀

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