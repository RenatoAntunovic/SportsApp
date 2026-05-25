# 🏆 SportsApp

> Full-stack sports tracking application for leagues, teams, players, and live matches — inspired by Flashscore.

![Java](https://img.shields.io/badge/Java-21-orange) ![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0-green) ![Angular](https://img.shields.io/badge/Angular-19-red) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-18-blue) ![JWT](https://img.shields.io/badge/JWT-Auth-yellow)

---

## 📋 Table of Contents

- [About](#about)
- [Screenshots](#screenshots)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Database](#database)
- [API Documentation](#api-documentation)
- [Key Implementation Highlights](#key-implementation-highlights)
- [Future Improvements](#future-improvements)

---

## 📖 About

SportsApp is a comprehensive sports tracking platform built with **Spring Boot 4** and **Angular 21**. It allows users to browse leagues, teams, players, and matches across multiple sports with **automatic standings calculation** using sport-specific rules.

The application features role-based access control with JWT authentication, allowing administrators to manage all entities through a dedicated admin panel, while regular users can browse content, mark favorites, and search globally across the platform.

---

## Screenshots

![Login](docs/screenshots/01-login.png)
*Login page — sign in, register, or continue as guest*

![Landing](docs/screenshots/02-landing.png)(docs/screenshots/landing2.png)
*Landing page — featured matches and personalized favorites section*

![Leagues](docs/screenshots/03-leagues.png)
*Leagues — filter by sport, toggle favorites only*

![Matches](docs/screenshots/04-matches.png)
*Matches — filter by sport, league, status and date*

![Football Standings](docs/screenshots/05-standings-football.png)
*Football standings — Champions League (green), Europa League (orange), Relegation (red)*

![Basketball Standings](docs/screenshots/06-standings-basketball.png)
*NBA standings — different columns (PCT, PF, PA) because basketball scores differently*

![Team Detail](docs/screenshots/07-team-detail.png)
*Team detail — full roster grouped by position and recent form*

![Match Detail](docs/screenshots/08-match-detail.png)
*Match detail — head-to-head history, team form (W/D/L), full rosters*

![Players](docs/screenshots/09-players.png)
*Players — browse with sport, league and team filters*

![Search](docs/screenshots/10-search.png)
*Global search — live autocomplete grouped by teams, leagues, players*

![Profile](docs/screenshots/11-profile.png)
*User profile — edit info, manage favorites, change password*

![Admin](docs/screenshots/12-admin.png)
*Admin panel — full CRUD with cascading filters*


---

## ✨ Features

### Public Features (Guests + Users)
- **Browse leagues, teams, players, and matches** across multiple sports
- **Match details** with head-to-head history and recent team forms
- **League standings** with automatic calculation based on sport type
- **Date filtering** on matches with calendar picker
- **Global search** with live autocomplete grouped by entity type
- **Sport-specific position grouping** (e.g., Goalkeeper → Defense → Midfield → Attack for football)

### User Features (Authenticated)
- **JWT-based authentication** with email and password
- **Favorites system** for teams and leagues with persistent storage
- **"My favorites only" filter** on leagues and teams pages
- **Personalized landing page** showing favorite teams' upcoming matches
- **Profile management** — edit username, email, change password (with show/hide toggle)
- **Toast notifications** for actions (favorited, removed, errors)

### Admin Features (Role: ADMIN)
- **Full CRUD** for sports, leagues, teams, players, matches
- **Hierarchical filters** — sport → league → team
- **Cascading dropdowns** in forms (selecting sport filters available leagues, etc.)
- **Sport-specific position mapping** when creating players
- **Match validation** — enforces logical rules (e.g., a SCHEDULED match can't have scores, FINISHED can't be in the future)
- **Automatic standings regeneration** after any match create/update/delete

---

## 🛠 Tech Stack

### Backend
- **Java 21** with **Spring Boot 4.0**
- **Spring Security** with **JWT** authentication
- **Spring Data JPA** with **Hibernate 7**
- **PostgreSQL 18** as database
- **Lombok** for boilerplate reduction
- **Springdoc OpenAPI** for Swagger documentation
- **BCrypt** for password hashing

### Frontend
- **Angular 21** (standalone components, signals)
- **TypeScript** with strict mode
- **RxJS** for reactive programming
- **Custom CSS** (no UI library — fully custom dark theme)
- **JWT interceptor** for automatic token attachment

### Tools
- **IntelliJ IDEA** for backend
- **VS Code** for frontend
- **pgAdmin 4** for database management
- **Postman / Swagger UI** for API testing
- **Git + GitHub** for version control

---

## Getting Started

**Requirements:** Java 21+, Node.js 18+, PostgreSQL 18+, Maven 3.8+

### 1. Clone the repository
Download or clone from GitHub:
`git clone https://github.com/RenatoAntunovic/SportsApp.git`

### 2. Set up the database
Open **pgAdmin**, create a new database called `sportsapp`, then right-click on it → **Restore** → select `database/sportsapp_dump.sql`. This loads all tables and pre-populated data automatically.

### 3. Run the backend
Open `sportsapp-backend` in **IntelliJ IDEA** and edit `src/main/resources/application.properties`:
spring.datasource.url=jdbc:postgresql://localhost:5432/sportsapp
spring.datasource.username=YOUR_POSTGRESQL_USERNAME
spring.datasource.password=YOUR_POSTGRESQL_PASSWORD
jwt.secret=ANY_RANDOM_STRING_MIN_32_CHARACTERS

- **username / password** — your local PostgreSQL credentials (set when you installed PostgreSQL)
- **jwt.secret** — any random string, at least 32 characters long (e.g. `mysecretkey12345678901234567890ab`)

Then run `SportsappApplication`. Backend starts at `http://localhost:8080`.

### 4. Run the frontend
Open `sportsapp-frontend` in **Visual Studio Code**, open the terminal and run:

`npm install` then `ng serve`

Frontend starts at `http://localhost:4200`.

| Role | Email | Password |
|------|-------|----------|
| Admin | renato@gmail.com | lozinka123 |
| User | register a new account | — |
