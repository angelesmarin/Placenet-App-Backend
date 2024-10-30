# Placenet Backend 
This is the backend for our Placenet react native mobile application so that our [front end](https://github.com/angelesmarin/Placenet-App-Frontend/tree/main) can interact with our backend api routes. We chose to create different repositories for modularity. These are the steps we took to set up the backend for our app:


**Here is information about our files!: [files](https://github.com/angelesmarin/Placenet-App-Backend/tree/development/documentation)**

## Prerequisite Installs:
* Javascript
  * language
  * https://nodejs.org/en 
* Node.js
  * runtime environment 
  * https://nodejs.org/en/download/package-manager
* Express.js
  * framework
  * https://expressjs.com/en/starter/installing.html
* PostgreSQL
  * nosql database
  * https://www.postgresql.org/download/
* Mutler
  * hamdle file uploads
  * https://www.npmjs.com/package/multer
* Axios lib
  * for testing
  * https://www.npmjs.com/package/axios 
* pg
  * Node library for database 
  * https://www.npmjs.com/package/pg 
* Insomnia
  * to test api endpoints 
  * https://insomnia.rest/download
 
Future iterations:
* Cors
	* specify which origins can access backend server
 	* https://www.npmjs.com/package/cors    
  
## 1. Make a RESTFUL API (Node.js; Express.js)
We first initialized our project and set up our server using Express.js.

**API**: set of rules to allow communication between back & front end; lets front end request, send, and receive data to & from the server. 


**RESTful API**: will let app fetch, send, update, delete data by making HTTP requests to server. 

Done by 
- intializing express.js project
- creating entry point: app.js 


## 2. Make Basic API structure (Express.js)
We set up a basic API structure to handle data requests, edits, file uploads, and overall communication between front and back end 

Here is the overall structure and folders we implemented:
* Routes
	* add initial folder that will direct requests to the right logic/ controller
* Controllers
	* add initial folder that will contain the logic that processes the requests + interacts with database 
* Models 
	* add initial folder that will contain the structure of the database

We implemented routes, controllers, and models for: 
* user authentication
* property management
* projct management
* document management 

## 3. Make PostgreSQL Database (PostgreSQL)
We created a database and tables for:
* user authentication
* property management
* projct management
* document management 
We then used Sequalize to manage these in our app. 
  
## 4. Set up Sequelize 
We made Sequelize models in the Models folder to match the tables we made in our database & synchronozed the models with our database. 

## 5. Define Controllers
We created controllers to handle and manage CRUD operations for our resources:
* users
* properties
* project
* documents

## 6. Handle File Uploads (Mutler)
Set up Mutler to save user uploaded PDF files in local folder. 

## 7. Set up API Routes 
In our Routes folder, we made files for our recourses and defined the CRUD operation routes for each resource, and registered these routes in our server.js file. 

## 6. Test API endpoints (Insomnia)
Used Insomnia to test each API endpoint, including CRUD operations for all our resources and verified that files were uploaded correctly:
- Users
  - GET /api/users
  - GET /api/users/:userId
  - POST /api/users
  - PUT /api/users/:userId
  - DELETE /api/users/:userId

- Properties
  - GET /api/properties
  - GET /api/properties/:propertyId
  - POST /api/properties
  - PUT /api/properties/:propertyId
  - DELETE /api/properties/:propertyId

- Projects
  - GET /api/projects
  - GET /api/projects/:projectId
  - POST /api/projects
  - PUT /api/projects/:projectId
  - DELETE /api/projects/:projectId

- Documents
  - GET /api/documents
  - POST /api/documents (file upload)

## 7. Connect frontend to baackend 
