## Grad Banking App Web UI

This directory contains a Web UI for grad-bank-app "Scott Cash".
Technologies used include Typescript, React/Redux and React Bootstrap.

To start it up:
  1.  Git pull this repository
  1.  Open it in VS Code or any other preferred editor.
  1.  If you are not already there, cd to web-ui directory
  1.  Do `npm install`
  1.  Do `npm start`

## Running With Docker
The application can be deployed using a Docker container following the steps below:
1. Build the application using `npm run build`
1. Run `docker build -t grad-bank-app-web-ui:latest .` to build the Docker image
    * Pass `--build-arg PORT=[PORT_NUMBER]` to specify a custom port to run the service on (This must happen at build time due to `EXPOSE`). Default is 5000
1. Run `docker run [OPTIONS] grad-bank-app-web-ui:latest` to start the server, with the following options:
    * `--rm` - Automatically clean up the container when the container exits
    * `-d` - Run the container in the background
    * `-p [HOST_PORT]:[CONTAINER_PORT]` - map a port on the host to the port in the container the UI service is running on (default 5000).
    * `-e PROXY=[proxyUrl]` - Set the PROXY environment variable, which is where the UI should route `/api` requests. Must include the protocol (i.e. `http://`, `https://`)

**Note:** When running with Docker, the UI is served by an Express server, found in `web-ui/server`. If you need to run the UI using this for any reason, you will need to do an `npm install` in the `web-ui/server` directory, then run `npm start`
