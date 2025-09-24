# SvaraAI Backend — Task & Project Management

This backend is a Node.js + Express + MongoDB (Mongoose) implementation for the Task & Project Management System.

## Folder structure

```
backend/
├── package.json
├── .env.example
├── jest.config.js
├── README.md
├── src/
│   ├── index.js
│   ├── app.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   └── Task.js
│   ├── repositories/
│   │   ├── userRepository.js
│   │   ├── projectRepository.js
│   │   └── taskRepository.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── projectService.js
│   │   └── taskService.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── projectController.js
│   │   └── taskController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   └── taskRoutes.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── utils/
│   │   └── pagination.js
│   └── validators/
│       └── taskValidator.js
└── tests/
    └── tasks.test.js
```

## Run locally
1. Copy `.env.example` to `.env` and update values.
2. `npm install`
3. Start MongoDB or set `MONGO_URI` to a cluster.
4. `npm run dev` or `npm start`

## Tests
`npm test` runs Jest integration tests (uses mongodb-memory-server).
