# Project Setup

## Prerequisites

- Node.js
- npm
- MongoDB

## Installation

1. Clone the repository:

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```

2. Install dependencies for both client and server:

    ```bash
    cd client
    npm install
    cd ../server
    npm install
    ```

## Data Import

Before running the server, it is important to import the data. You can import data using the `luxury_watches.csv` file by running the `importData.js` script.

1. Ensure MongoDB is running.
2. Run the data import script:

    ```bash
    node importData.js
    ```

## Running the Server

1. Navigate to the server directory:

    ```bash
    cd server
    ```

2. Start the server:

    ```bash
    node server.js
    ```

## Running the Client

1. Navigate to the client directory:

    ```bash
    cd client
    ```

2. Start the client:

    ```bash
    npm start
    ```

## Summary

- Import data using `luxury_watches.csv` by running `importData.js`.
- Run the server with `node server.js`.
- Run the client with `npm start`.
- Remember that Q5 is implemented in server from line number 97 
---

### Coded by iamjayantjha