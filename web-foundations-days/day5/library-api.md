# Library Books API

This document outlines the RESTful API endpoints for managing a library's book collection.

## Endpoints

### 1. List all books
- **Method:** `GET`
- **Path:** `/api/books`
- **Description:** Retrieves a paginated list of all books in the library.
- **Request Body:** None
- **Success Status Code:** `200 OK`

### 2. Get a specific book
- **Method:** `GET`
- **Path:** `/api/books/{id}`
- **Description:** Retrieves the details of a single book by its unique ID.
- **Request Body:** None
- **Success Status Code:** `200 OK`

### 3. Create a new book
- **Method:** `POST`
- **Path:** `/api/books`
- **Description:** Adds a new book to the library catalog.
- **Request Body:** 
  ```json
  {
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "isbn": "978-0743273565",
    "publishedYear": 1925
  }