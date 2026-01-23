# Notes & GitHub Projects Manager

Aplicatie web full-stack pentru gestionarea notitelor asociate proiectelor software,
cu integrare GitHub. Utilizatorii se pot autentifica, pot adauga repository-uri GitHub
(teme/proiecte) si pot crea notite asociate fiecarui repository.

## Tehnologii utilizate

Backend:

- Node.js
- Express.js
- Prisma ORM
- SQLite
- JWT
- bcrypt

Frontend:

- React.js
- Axios
- Tailwind CSS

## Prerequisites

- Node.js
- npm

## Setup Instructions

### Backend Setup

1. Navigheaza in folderul backend:
   cd backend

2. Instaleaza dependentele:
   npm install

3. Creeaza fisierul .env in folderul backend, la nivel de root:
   DATABASE_URL="file:./prisma/dev.db"
   JWT_SECRET="supersecret"

4. Initializeaza baza de date:
   npx prisma migrate dev --name init

5. Genereaza Prisma Client:
   npx prisma generate

6. Porneste serverul backend:
   npm start

Backend-ul va rula pe http://localhost:5001

### Frontend Setup

1. Navigheaza in folderul frontend:
   cd frontend

2. Instaleaza dependentele:
   npm install

3. Porneste aplicatia frontend:
   npm run dev

Frontend-ul va rula pe http://localhost:5173

## Prisma Studio (UI pentru baza de date)

Pentru a vizualiza si gestiona datele din baza de date folosind Prisma:

1. Navigheaza in folderul backend:
   cd backend

2. Porneste Prisma Studio:
   npx prisma studio

3. Prisma Studio va porni localhost, portul fiind afisat in terminal

## Functionalitati

- Autentificare utilizator (Register / Login)
- Persistenta autentificarii folosind JWT
- Gestionare repository-uri GitHub (CRUD)
- Gestionare notite (CRUD)
- Asociere notite cu repository-uri GitHub
- Acces la date doar pentru utilizatorul autentificat
- Relatii parinte-copil intre entitati:
  User -> GitHubRepo
  User -> Note
  GitHubRepo -> Note

## Resetare baza de date (optional)

cd backend
rm -rf prisma/migrations
rm -f prisma/dev.db
npx prisma migrate dev --name init
