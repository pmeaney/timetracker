
A fullstack javscript app (expressjs/reactjs) for tracking timesheets for hourly employees.

To set this up locally for yourself would require a few steps:
- Install & configure postgreSQL
- Clone & install this project in two locations:
  - root directory
  - server directory: ./src/server
- Create .env file credentials (DB, API)
- Run knex db migrations & seeding, and manually create sessions table for express-sessions
- Compile frontend client with webpack configuration files
- Run server ("npm run dev" -- see clientside package.json)
  - Admin page: http://localhost:3000/dashboard/admin_dash
  - Registration page: http://localhost:3000/auth/register --> forwards to employee page
  - Login page: http://localhost:3000/auth/login --> forwards to employee page

#### Frontend javascript frameworks (business logic, configuration, user interface):

| Framework                          | Purpose  
| ---------------------------------- | -------
| [ReactJS](https://reactjs.org/)    | Main structure of frontend application logic, including user experience and backend communication 
| [Redux](https://redux.js.org/)     | Maintains frontend application state in centralized location
| [Webpack](https://webpack.js.org)  | Bundles multiple project files and packages together into single files and transforms them for optimized browser experience
| [Babel](https://babeljs.io)        | Transpiles ReactJS components & css, configures javascript for targeted browser(s)

#### Frontend css frameworks (user interface design):

| Framework                          | Purpose  
| ---------------------------------- |-------
| [Sass](https://sass-lang.com/libsass)  | An enhanced version of css, allowing for programmatic, extendible, compiled css (sass/scss) 
| [Bulma](https://bulma.io)         | A simple css frontend design and formatting framework 
| [Bootstrap](https://allenfang.github.io/react-bootstrap-table/)     | A responsive, sass framework (used with react-bootstrap-table) 

#### Frontend REST API:

| API                                | Purpose  |
| ---------------------------------- |-------|
| [Google Maps](https://github.com/tomchentw/react-google-maps) | Mapping employee system users (timesheet clockin/clockout)
| [Google Map address auto-complete](https://github.com/hibiken/react-places-autocomplete) | Automatically completes geographical address information as user type (employee/user profile)
| [App's backend REST API](https://github.com/pmeaney/timetracker/tree/master/src/server/) | Database communication including user authentication & business data CRUD


#### Important backend (NodeJS) packages include:

| Package      |  Purpose  
| -------------|-----------
| [NodeJS](https://nodejs.org/en/)       | Underlying runtime environment which executes javascript server code
| [ExpressJS](https://expressjs.com/)    | Minimalist server web application framework & REST API
| [bluebird](https://www.npmjs.com/package/bluebird)     | Enhances asynchronous programming 
| [csurf](https://www.npmjs.com/package/csurf)        | API communication validation & form security
| [bcrypt](https://www.npmjs.com/package/bcrypt)       | Oneway password encryption in user authentication system 
| [express-session](https://www.npmjs.com/package/express-session) | Temporarily stores user-related application information such as user permissions, application configuration, and application messages
| [KnexJS](https://knexjs.org) | Interacts with PostgreSQL database to implment database connectivity & data retrieval in javascript
| [multer](https://www.npmjs.com/package/multer) | Uploads files

#### Other important project platforms:

| Platform      |  Purpose  
|---------------|-----------
| [PostgreSQL](https://www.postgresql.org/)      | SQL Database
| [Nginx](https://www.nginx.com)         | Web server software
| [Ubuntu Server](https://www.ubuntu.com/server) | Server operating system

#### For full list of dependencies, see:
- [Clientside package.json](https://github.com/pmeaney/timetracker/blob/master/package.json)
- [Serverside package.json](https://github.com/pmeaney/timetracker/blob/master/src/server/package.json)

#### Project ERD
(Generated with [DbVis](https://www.dbvis.com))
![Project ERD](https://github.com/pmeaney/timetracker/blob/master/src/server/public/project_documentation/ERD_3_29_2019.png)
<!-- 
![alt screenshot2](https://github.com/pmeaney/timetracker/blob/master/src/server/public/project_documentation/screenshots/2.png)

![alt screenshot3](https://github.com/pmeaney/timetracker/blob/master/src/server/public/project_documentation/screenshots/3.png)

![alt screenshot4](https://github.com/pmeaney/timetracker/blob/master/src/server/public/project_documentation/screenshots/4.png)

![alt screenshot5](https://github.com/pmeaney/timetracker/blob/master/src/server/public/project_documentation/screenshots/5.png) -->
