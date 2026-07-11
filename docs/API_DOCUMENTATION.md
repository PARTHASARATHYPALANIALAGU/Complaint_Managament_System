# API Documentation

Base URL: `http://localhost:8000/api`

## Authentication (`/api/auth`)

| Method | Endpoint | Request Body | Response | Description |
|--------|----------|--------------|----------|-------------|
| POST | `/register` | `{name, email, password, role}` | `User` | Register a new user |
| POST | `/login` | `{email, password}` | `{access_token}` | Login and get JWT |
| GET | `/me` | None (Requires Bearer token) | `User` | Get current logged in user |

## Complaints (`/api/complaints`)

| Method | Endpoint | Request Body | Response | Description |
|--------|----------|--------------|----------|-------------|
| POST | `/` | `FormData(title, description, image)` | `Complaint` | Create complaint (auto-runs AI) |
| GET | `/my` | None (Requires Bearer token) | `[Complaint]` | Get student's own complaints |
| GET | `/{id}` | None (Requires Bearer token) | `Complaint` | Get single complaint by ID |

## Admin (`/api/admin`)

| Method | Endpoint | Query Params | Response | Description |
|--------|----------|--------------|----------|-------------|
| GET | `/complaints` | `status`, `search`, `skip`, `limit` | `[Complaint]` | List all complaints |
| PATCH | `/complaints/{id}/status` | `{status}` | `Complaint` | Update complaint status |

## Analytics (`/api/analytics`)

*All analytic endpoints require Admin role.*

| Method | Endpoint | Response | Description |
|--------|----------|----------|-------------|
| GET | `/summary` | `{total, pending, resolved, high_priority}` | High-level metrics |
| GET | `/categories` | `[{category, count}]` | Group by category |
| GET | `/sentiment` | `[{sentiment, count}]` | Group by sentiment |
| GET | `/trends` | `[{month, count}]` | Monthly submissions |
| GET | `/export/csv` | `text/csv` stream | Download all data as CSV |
