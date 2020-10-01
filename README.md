# Safe Docs System

A system for storing documents safely.

## Required
- maven 3
- java 11

> Only for the frontend application:
- node 10.16.0
- npm 6.9.0

## Installation

Use [maven](https://maven.apache.org/download.cgi) to build the packaged backend & frontend and run the jar with [java](https://www.oracle.com/java/technologies/javase-jdk11-downloads.html).

```bash
cd ./api
mvn clean install
java -jar target/name-of-the-jar.jar
```

> Note: The frontend is already packaged with the backend so it's accessible without running the angular app explicitly.
> But, if needed, use this to install dependencies & run the application.
Use [npm](https://www.npmjs.com/get-npm) to install the dependencies and run the frontend app.

```bash
cd ./web
npm install
npm start
```
