# Wheel of Fortune - Vanilla JavaScript Widget

A standalone **Wheel of Fortune** widget built with pure Vanilla JavaScript, without any external libraries, plugins, or modules.

---

## Project Overview

This widget allows users to submit their Name, Surname, and Email through a validated form. Upon submission, the user can spin a simple SVG-based wheel divided into 12 segments. There are 4 winning segments and 8 “Try Again” segments. The user has two attempts to spin the wheel. If the wheel lands on a winning segment, an AJAX call fetches the prize information from a static JSON file and displays a congratulatory message. Otherwise, a “Try Again” message is shown.

---

## Features

- Basic form with validation for Name, Surname, and Email fields.
- Simple SVG circle wheel with 12 equally spaced segments.
- Two spin attempts per user.
- Spin animation that randomly stops on one of the 12 segments.
- AJAX call to a static JSON file to retrieve prize data on a win.
- Dynamic messages for win or try again outcomes.

---

## Technical Details

- Developed using plain Vanilla JavaScript — no dependencies.
- AJAX requests with CORS support.
- Well-structured code centered around a single initializing main class.
- Minimalist black-and-white SVG design for the wheel.
- Static JSON file used to simulate prize retrieval.

---

## Important: Running the Project Locally

Due to browser security policies related to **CORS (Cross-Origin Resource Sharing)**, the AJAX requests will be blocked if you open the `index.html` file directly from your filesystem (`file://` protocol).

To ensure the AJAX requests work correctly, **run the project on a local or remote HTTP server**.

### Recommended ways to run a local server:

- Use the **Live Server** extension in Visual Studio Code.
- Run a simple Python HTTP server:
  ```bash
  python -m http.server 8000
  ```
- Use Node.js `http-server` package:
  ```bash
  npx http-server
  ```

After starting the server, open your browser at `http://localhost:8000` (or your chosen port) to run the widget properly.

---

## How to Use

1. Clone or download this repository.
2. Start a local server in the project directory (see above).
3. Open the application URL in your browser.
4. Fill in the form with your Name, Surname, and Email.
5. Submit the form to reveal the Wheel of Fortune.
6. Spin the wheel (up to two times).
7. On a win, see your prize details fetched via AJAX.
8. Otherwise, try again!

---

## Included Files

- `index.html` — Main HTML page with form and wheel.
- `style.css` — Basic styling for the widget.
- `wheel.js` — Main JavaScript class handling widget logic.
- `prizes.json` — Static JSON file containing prize information.

---

Feel free to explore, customize, or improve the widget!
