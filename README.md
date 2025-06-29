# URL Shortener App

## Description

A simple URL shortener built using pure Node.js without any external frameworks or databases. Users can enter a URL and optionally provide a shortcode to generate a shortened link. All data is stored in a JSON file on the server.

## Features

- Enter a URL to generate a short link.
- Optionally provide a custom shortcode.
- Redirects to the original URL when the short link is visited.
- View all existing shortened URLs on the page.

## How to Run

1. Clone the repository.
2. Install Node.js (if not already installed).
3. Create a `data` directory in the project root.
4. Run the server using:

   ```bash
   node app.js
   ```

5. Open `http://localhost:3002` in your browser.

## Technologies Used

- Node.js core modules (`http`, `fs`, `path`, `crypto`)
- HTML/CSS/JavaScript frontend

## License

This project is licensed under the MIT License.
