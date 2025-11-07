📚 Adaptive Learning Platform (ALP)

Project Status: Complete | Stack: MERN (MongoDB, Express, React, Node.js) + Docker

🎯 1. Project Goal & Overview

The Adaptive Learning Platform (ALP) is designed to dynamically personalize the educational experience. Its primary function is to adjust quiz difficulty in real-time based on a student's calculated proficiency, ensuring that learners are always challenged appropriately and focused on mastering their weakest areas.

Key Functional Requirements

Rules-Driven Adaptation: Dynamic quiz assembly based on topic mastery scores.

Role Management: Segregated dashboards and access for Admin, Instructor, and Student roles.

Analytics: Detailed student performance tracking and instructor overview dashboards.

UX/UI: Modern, responsive design with instant feedback mechanisms.

🛠️ 2. Technology Stack & Architecture

This application is built on a containerized MERN stack, ensuring consistency and easy deployment across environments.

Category

Technology

Purpose
d
Frontend

React.js (CRA)

Component-based UI rendering.

Styling

Tailwind CSS

Responsive, utility-first styling for modern aesthetics.

Animation

Framer Motion

Subtle, high-quality transitions for smooth UX.

Backend/API

Node.js / Express.js

Handles core business logic, routing, and database interaction.

Database

MongoDB

Stores flexible schemata: Users, Questions, and complex LearnerModels.

Orchestration

Docker & Docker Compose

Manages three interconnected services (mongo, server, client).

Security

JWT / Bcrypt

Token-based authentication and secure password hashing.

⚙️ 3. Core Feature Implementation

3.1. Adaptive Quizzing Loop

The platform employs a calculated adaptive loop determined by the student's Mastery Score (a rolling average of recent performance on a topic):

Read Mastery: Student requests quiz on Topic X (e.g., Algebra). API checks student's mastery score (e.g., 0.35).

Determine Difficulty: The system routes the query based on the score:

Score < 0.40: Fetches easy questions.

Score 0.40 - 0.80: Fetches medium questions.

Score > 0.80: Fetches hard questions.

Instant Feedback (/quiz/check): Provides per-question grading and detailed explanations before moving to the next question.

3.2. Data Models (LearnerModel)

The foundation of adaptation lies in the LearnerModel schema, which stores critical student-specific data points:

Mastery Map (Map<Topic, Score>): Stores the proficiency percentage and total attempts for every specific topic.

Attempt History: Records individual question results (question ID, correctness, time taken) for analytical review.

3.3. Instructor Analytics

The Instructor Console features the Student Performance Overview table, which fetches and displays the averaged mastery scores for the entire student cohort, using the secure, protected API endpoint /api/users/analytics/students.

🏃 4. Installation and Setup

Prerequisites

Docker Desktop: Running in the background.

MongoDB Compass: (Optional) To view data, connect to mongodb://localhost:27017.

Execution Steps

Build and Run the Stack:

# Run this from the project root directory
docker-compose up --build

Seed the Database (CRITICAL): Open a separate terminal window and run the seeder to populate the database with users and 30+ questions:

docker-compose exec server sh -c "npm run seed"


