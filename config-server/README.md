# Config Server

Simple Express server to host the import-map.json configuration for the microfrontend shell.

## Setup

```bash
npm install
npm start
```

Server runs on http://localhost:9000

## Endpoints

- `GET /import-map.json` - Returns the import map configuration
- `GET /health` - Health check endpoint

## Usage

The RRV7 shell app fetches the import map from this server to dynamically register microfrontends without rebuilding.

To add a new microfrontend:
1. Update `import-map.json` in this folder
2. Restart this server (if needed)
3. Refresh the shell app - no rebuild required!