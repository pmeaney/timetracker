
A fullstack javscript app (expressjs/reactjs) for tracking timesheets for hourly employees.

To set this up locally for yourself would require a few steps:
- Clone & install
- Install & configure postgreSQL 
- Create .env file credentials (DB, API)
- Run knex db migrations & seeding, and manually create sessions table for express-sessions
- Compile frontend client with webpack configuration files
- Run server ("npm run dev" -- see clientside package.json)


#### Frontend business logic, UX/UI, and configuration frameworks used:

| Framework                          | Language      | Purpose  
| ---------------------------------- |---------------|-------
| [ReactJS](https://reactjs.org/)    | Javascript    | Main structure of frontend application logic, including user experience and backend communication 
| [Redux](https://redux.js.org/)     | Javascript    | Maintains application state in centralized location
| [Webpack](https://webpack.js.org)  | Javascript    | Bundles multiple project files and packages together into single files and transforms them for optimized browser experience
| [Babel](https://babeljs.io)        | Javascript    | Compiles ReactJS components & css

#### Frontend css frameworks for formatting and UX design:

| Framework                          | Purpose  
| ---------------------------------- |-------
| [Sass](https://sass-lang.com/libsass)          | An enhanced version of css, allowing for programmatic, extendible, compiled type of css (sass/scss) 
| [Bulma](https://bulma.io)         | A simple css frontend design and formatting package 
| [Bootstrap](https://allenfang.github.io/react-bootstrap-table/)     | A responsive, sass package (used with react-bootstrap-table) 

#### Frontend REST API:

| API                                | Purpose  |
| ---------------------------------- |-------|
| [Google Map Mapping](https://github.com/tomchentw/react-google-maps) | Mapping employee system users (timesheet clockin/clockout)
| [Google Map address auto-complete](https://github.com/hibiken/react-places-autocomplete) | Automatically completes geographical address information as user type (employee/user profile) |
| [App's backend REST API](https://github.com/pmeaney/timetracker/tree/master/src/server/) | Database communication including user authentication & business data CRUD


#### Important backend (NodeJS) packages include:

| Package      |  Purpose  
| -------------|-----------
| [NodeJS](https://nodejs.org/en/)       | Underlying runtime environment which executes javascript server code
| [ExpressJS](https://expressjs.com/)    | Minimalist server web application framework & REST API
| [bluebird](https://www.npmjs.com/package/bluebird)     | Enhances asynchronous programming 
| [CSURF](https://www.npmjs.com/package/csurf)        | API communication validation & form security (Http post & put requests)
| [bcrypt](https://www.npmjs.com/package/bcrypt)       | Oneway password encryption in user authentication system (salt & hash)
| [express-session](https://www.npmjs.com/package/express-session) | Stores temporary backend user communication information (sessions)
| [KnexJS](https://knexjs.org) | Interacts with PostgreSQL database to implment database retrieval in javascript (allows for database + JS program interaction including migration and seeding, improves security, reduces complexity)
| [multer](https://www.npmjs.com/package/multer) | File uploads

#### Other important project platforms:

| Platform      |  Purpose  
|---------------|-----------
| [PostgreSQL](https://www.postgresql.org/)      | SQL Database
| [Nginx](https://www.nginx.com)         | Web server software (reverse proxy)
| [Ubuntu Server](https://www.ubuntu.com/server) | Server operating system (Open source linux distribution)


#### Project ERD
(Generated with [DbVis](https://www.dbvis.com))
![Project ERD](https://github.com/pmeaney/timetracker/blob/master/src/server/public/project_documentation/ERD_3_25_2019.png)
<!-- 
![alt screenshot2](https://github.com/pmeaney/timetracker/blob/master/src/server/public/project_documentation/screenshots/2.png)

![alt screenshot3](https://github.com/pmeaney/timetracker/blob/master/src/server/public/project_documentation/screenshots/3.png)

![alt screenshot4](https://github.com/pmeaney/timetracker/blob/master/src/server/public/project_documentation/screenshots/4.png)

![alt screenshot5](https://github.com/pmeaney/timetracker/blob/master/src/server/public/project_documentation/screenshots/5.png) -->
