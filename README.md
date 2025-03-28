# Book Search Application

## Overview
This is a JavaScript-based book search application that fetches book data from an API and displays the results with sorting, filtering, pagination, and dark/light mode support.

## Features
- Fetches book data from `https://api.freeapi.app/api/v1/public/books`
- Search books dynamically
- Sort books based on title, author, or other criteria
- Supports both list and grid view
- Implements pagination with next/previous page navigation
- Dark and light mode toggle

## Technologies Used
- JavaScript
- HTML/CSS
- Fetch API
- Debouncing for search
- Event listeners for dynamic UI updates

## Setup Instructions
1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```
2. Open `index.html` in a browser.
3. Ensure an active internet connection to fetch book data.

## Usage
- Use the search input to filter books dynamically.
- Change the sorting and filtering options to organize results.
- Navigate pages using the pagination buttons.
- Toggle between dark and light modes for better visibility.

## Code Structure
- `fetchBooks(searchBookValue, limit, page)`: Fetches books based on user input and pagination.
- `initialize(searchBookValue, limit, page)`: Initializes and renders books.
- `renderBooks(books)`: Dynamically creates book cards and displays them.
- Pagination logic ensures seamless navigation.

## License
This project is licensed under the MIT License.