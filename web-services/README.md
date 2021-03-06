# Grad banking app - Web Services


## Installing and running as a dev environment
1. Clone repo and cd into web-services
1. Run `Gradle clean build bootJar`
1. Copy the jar from build/libs to where you want it
1. Install and run an SQL server (MariaDB used for dev)
	- MariaDB can be downloaded and installed from https://downloads.mariadb.org/mariadb/10.2.11/
	- A database environment such as MySql Workbench can be used to administrate the schema
		- This can be downloaded from https://dev.mysql.com/downloads/workbench/
1. Make a schema on the DB and a new user who is limited to that schema
1. Setup Environment variables for the JWT_SECRET:
	- Create a new user environment variable named `JWT_SECRET` and make sure the value is at least 64 characters long
1. Copy src/main/resources/application.properties to the same directory as the jar file **and edit**  
  Ensure the following edits are completed:
    - Changed port to a valid, unused port
    - Changed SQL database details to connect to your SQL DATABASE.
1. Run `java -jar BootGradApp.jar` <- change .jar reference to the jar file generated by `gradle bootJar`
    - This project is built with java 11, you will need to run it with java 11.  
    If the java version that your $JAVA_HOME variable is referring to is not java 11 then you will either need to update it or use the explicit file path to the java 11 executable
1. The documentation will now be available at http://localhost:8080/swagger-ui.html#/ or whichever port you specified, and the api will be at [/api](http://localhost:8080/api)

## Running With Docker
The application can be deployed using a Docker container following the steps below (Note: requires local mariaDB service running):
1. Build the application using `Gradle clean build bootJar`
1. Run `docker build -t grad-bank-app-web-services:latest .` to build the Docker image
1. Run `docker run --rm --network="host" grad-bank-app-web-services:latest` to start the server
1. To run the server as a background process, run `docker run -d --network="host" grad-bank-app-web-services:latest`
1. Access the service at `http://localhost:8080`

## Testing
Unit testing is done using JUnit and Mockito. Good unit tests will be:
* Easy to Write - Should not be difficult to add more tests
* Readable - Should be easy to skim and see what the test is trying to do
* Reliable - Should pass every time the tests are run
* Fast - Should run in a relatively short time-frame, so developers don't get frustrated
* Should only test a small set of methods/classes - Reducing the scope of the tests helps increase confidence that the method under test is working as intended
