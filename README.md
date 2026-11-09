# 🍕 Pizzeria — MEAN Stack Pizza Ordering App

A full-stack pizza ordering application built with the **MEAN stack** (MongoDB, Express, Angular, Node.js). Users can browse a pizza menu, build their own pizza by choosing ingredients, manage a shopping cart, and check out with accurate, real-time billing. Completed orders are saved to MongoDB.

> Capstone project — Full Stack Web Development

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Endpoints](#api-endpoints)
- [Data Models](#data-models)
- [Application Pages](#application-pages)
- [Key Design Decisions](#key-design-decisions)
- [Known Limitations](#known-limitations)
- [Future Improvements](#future-improvements)

---

## Features

- **Browse the menu**: pizzas load live from MongoDB with name, description, price, image, ingredients, toppings and a veg / non-veg indicator
- **Build your own pizza**: pick ingredients with checkboxes and watch the total update instantly
- **Cart management**: add items, increase or decrease quantity, remove items, clear the cart
- **Accurate billing**: pizza subtotal, ingredients subtotal and grand total are calculated live
- **Ingredients dropdown**: the cart lists the extra ingredients selected on the Build Your Pizza page
- **Cart persistence**: the cart survives a page refresh using `localStorage`
- **Checkout**: clicking Pay saves the order to MongoDB
- **Order history**: a My Orders page lists previously placed orders
- **Cart badge**: the navbar shows the live item count
- **Error handling**: friendly loading and error messages if the backend is unreachable

---

## Tech Stack

| Layer    | Technology                                           |
|----------|------------------------------------------------------|
| Database | MongoDB                                              |
| Backend  | Node.js, Express.js, Mongoose                        |
| Frontend | Angular 17 (standalone components), RxJS, TypeScript |
| Other    | CORS, dotenv, nodemon                                |

---

## Architecture

```
┌──────────────────┐   HTTP / JSON   ┌───────────────────┐   Mongoose   ┌──────────┐
│  Angular (:4200) │ ──────────────► │  Express API      │ ───────────► │ MongoDB  │
│  Single Page App │ ◄────────────── │  Node.js (:5000)  │ ◄─────────── │ (:27017) │
└──────────────────┘                 └───────────────────┘              └──────────┘
```

- Angular never talks to MongoDB directly; it only calls the Express REST API.
- The frontend and backend run independently on different ports, so the backend enables CORS.
- Shared cart state is managed by a `CartService` built on an RxJS `BehaviorSubject`, so the navbar badge and the cart page always stay in sync.

---

## Project Structure

```
pizzeria-mean/
├── backend/
│   ├── models/
│   │   ├── Pizza.js
│   │   ├── Ingredient.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── pizzas.js
│   │   ├── ingredients.js
│   │   └── orders.js
│   ├── .env
│   ├── package.json
│   ├── seed.js            # loads sample pizzas and ingredients
│   └── server.js          # Express app entry point
│
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   │   ├── navbar/
    │   │   │   ├── home/
    │   │   │   ├── order-pizza/
    │   │   │   ├── build-pizza/
    │   │   │   ├── cart/
    │   │   │   └── order-history/
    │   │   ├── models/        # TypeScript interfaces
    │   │   ├── services/      # pizza, cart and order services
    │   │   ├── app.component.ts
    │   │   └── app.routes.ts
    │   ├── assets/images/     # pizzas, ingredients, home, logo
    │   ├── index.html
    │   ├── main.ts
    │   └── styles.css
    ├── angular.json
    └── package.json
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later and npm
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally (or a MongoDB Atlas connection string)
- [Angular CLI](https://angular.dev/tools/cli): `npm install -g @angular/cli`
- [VS Code](https://code.visualstudio.com/) (or any editor)

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repo-name>.git
cd <your-repo-name>
```

### 2. Add the images

Place your images under `frontend/src/assets/images/` using the filenames referenced in `backend/seed.js`:

```
assets/images/
├── pizzas/         paneer-tikka.jpg, chicken-italiaona.jpg, veggie-supreme.jpg,
│                   tripple-chicken-feast.jpg, ultimate-chicken.jpg
├── ingredients/    pepperoni.jpg, mushroom.jpg, black-beans.jpg, black-olive.jpg,
│                   green-olive.jpg, jalapeno.jpg, chicken.jpg, tomato.jpg,
│                   red-paprika.jpg, paneer.jpg, fried-onion.jpg, capsicum.jpg,
│                   sweet-corn.jpg
├── home/           ingredients.jpg, our-chefs.jpg, delivery-timer.jpg
└── logo/           pizzeria-logo.png
```

Angular serves everything in `assets/`, so the image paths stored in MongoDB resolve against the frontend at `http://localhost:4200/assets/...`.

### 3. Set up and run the backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/pizzeria
PORT=5000
```

Seed the database and start the server:

```bash
npm run seed    # inserts sample pizzas and ingredients
npm run dev     # starts the API with nodemon on http://localhost:5000
```

Verify it works by opening <http://localhost:5000/api/pizzas>, which should return JSON.

### 4. Set up and run the frontend

Open a second terminal:

```bash
cd frontend
npm install
ng serve -o
```

The app opens at <http://localhost:4200>.

> Run the backend first. If MongoDB or the API is not running, the pages show an error message instead of data.

### Available scripts

**Backend**

| Command        | Description                                       |
|----------------|---------------------------------------------------|
| `npm start`    | Start the server with Node                        |
| `npm run dev`  | Start with nodemon (auto-restart on changes)      |
| `npm run seed` | Clear and re-insert sample pizzas and ingredients |

**Frontend**

| Command       | Description                              |
|---------------|------------------------------------------|
| `ng serve`    | Start the dev server on port 4200        |
| `ng serve -o` | Same, and open the browser automatically |
| `ng build`    | Production build into `dist/`            |

---

## API Endpoints

Base URL: `http://localhost:5000/api`

| Method | Endpoint       |  Description                 |
|--------|----------------|------------------------------|
| GET    | `/pizzas`      | Get all pizzas               |
| GET    | `/pizzas/:id`  | Get a single pizza           |
| POST   | `/pizzas`      | Create a pizza               |
| GET    | `/ingredients` | Get all ingredients          |
| POST   | `/ingredients` | Create an ingredient         |
| POST   | `/orders`      | Place a new order            |
| GET    | `/orders`      | Get all orders, newest first |
| GET    | `/orders/:id`  | Get a single order           |

**Example: place an order**

```http
POST /api/orders
Content-Type: application/json

{
  "items": [
    { "name": "Paneer Tikka", "unitPrice": 290, "quantity": 2, "extraIngredients": [] }
  ],
  "pizzaSubtotal": 580,
  "ingredientsSubtotal": 0,
  "total": 580
}
```

An empty `items` array returns `400 Bad Request`.

---

## Data Models

**Pizza**

| Field       | Type                     |
|-------------|--------------------------|
| name        | String (required)        |
| description | String (required)        |
| price       | Number (required)        |
| image       | String (required)        |
| ingredients | String (required)        |
| toppings    | String (required)        |
| isVeg       | Boolean (default `true`) |

**Ingredient**

| Field | Type              |
|-------|-------------------|
| name  | String (required) |
| price | Number (required) |
| image | String (required) |

**Order**

| Field                 | Type                                                         |
|-----------------------|--------------------------------------------------------------|
| items                 | Array of `{ name, unitPrice, quantity, extraIngredients[] }` |
| pizzaSubtotal         | Number                                                       |
| ingredientsSubtotal   | Number                                                       |
| total                 | Number                                                       |
| status                | `placed` or `paid` (default `paid`)                          |
| createdAt / updatedAt | Auto-generated timestamps                                    |

---

## Application Pages

| Route          | Page           | What it does                                     |
|----------------|----------------|--------------------------------------------------|
| `/`            | Home           | Our story, ingredients, chefs, delivery info     |
| `/order-pizza` | Order Pizza    | Menu loaded from the API, Add to Cart            |
| `/build-pizza` | Build Ur Pizza | Ingredient checkboxes with live total            |
| `/cart`        | Shopping Cart  | Quantity controls, bill breakdown, Pay and Clear |
| `/my-orders`   | My Orders      | Order history from MongoDB                       |

---

## Key Design Decisions

- **Standalone Angular components**: no `NgModule` boilerplate; routing is configured with `provideRouter()`.
- **Service layer**: all HTTP calls live in `PizzaService` and `OrderService`; components never call the API directly.
- **Reactive state with RxJS**: `CartService` holds cart state in a `BehaviorSubject`. Every subscriber updates instantly when the cart changes, with no manual refresh and no prop drilling.
- **Derived totals**: subtotals and totals are computed from current state rather than stored, so they cannot go stale.
- **Seed script**: `seed.js` gives a fresh database a known, repeatable set of data in one command.
- **Separation of concerns**: the REST API is fully decoupled from the UI, so a different client could reuse it.

---

## Screenshots

**Home page**

<img width="1915" height="966" alt="Screenshot 2026-11-09 172345" src="https://github.com/user-attachments/assets/955938a5-7615-4959-a8d5-db4e58345f16" />

**Order-pizza**

<img width="1917" height="965" alt="Screenshot 2026-11-09 172511" src="https://github.com/user-attachments/assets/830c1cd9-1c6b-4c04-9604-2ad88f162a22" />

**Personalize your pizza**

<img width="1915" height="965" alt="Screenshot 2026-11-09 172430" src="https://github.com/user-attachments/assets/b3635ad3-0f08-4560-b799-d43c3e13a5ab" />

**My-orders**

<img width="1917" height="962" alt="Screenshot 2026-11-09 172452" src="https://github.com/user-attachments/assets/cbca31f8-f986-44a7-bc8f-9ca7330da429" />

**Cart**

<img width="1917" height="965" alt="Screenshot 2026-11-09 172511" src="https://github.com/user-attachments/assets/9265a0f7-7eef-45b5-86fb-4e42da746531" />

---

## Future Improvements

- User registration and login with JWT, and per-user carts and order history
- Real payment integration
- Admin dashboard to add, edit and remove pizzas and ingredients
- Angular environment files for configurable API URLs
- Search, filtering and pagination on the menu
- Order status tracking
- Unit and end-to-end tests

---

## Author

G K Megavarshini
GitHub: https://github.com/Megavarshini31

---

## License

This project was built for educational purposes as a capstone project.
