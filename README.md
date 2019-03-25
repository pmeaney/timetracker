
This is an fullstack javscript app (expressjs/reactjs) for tracking timesheets for hourly employees.

I had initially written a frontend prototype with jQuery, but decided to switch to ReactJS.  

- Frontend: ReactJS, Sass, Webpack
- Backend: ExpressJS, NodeJS
- Database: PostgreSQL -> KnexJS

#### Frontend business logic, UX/UI, and configuration frameworks used:

| Framework                          | Language      | Purpose  
| ---------------------------------- |---------------|-------
| [ReactJS](https://reactjs.org/)    | Javascript    | Main structure of frontend application logic, including user experience and backend communication 
| [Redux](https://redux.js.org/)     | Javascript    | Maintains application state in centralized location
| [Webpack](https://webpack.js.org)  | Javascript    | Bundles multiple project files and packages together into single files and transforms them for optimized browser experience
| [Babel](https://babeljs.io)        | Javascript    | Compiles ReactJS components & css

#### Frontend css frameworks for formatting and UX design:

| Framework                          | Language      | Purpose  
| ---------------------------------- |---------------|-------
| Sass          | CSS           | An enhanced version of css, allowing for programmatic, extendible, compiled type of css (sass/scss) 
| Bulma         | CSS           | A simple css frontend design and formatting package 
| Bootstrap     | CSS           | A responsive, sass package (used with react-bootstrap-table) 

#### Frontend REST API:

| API                                | Purpose  |
| ---------------------------------- |-------|
| [Google Map Mapping](https://github.com/tomchentw/react-google-maps) & [Google Map address auto-complete](https://github.com/hibiken/react-places-autocomplete) | Mapping employee system users (timesheet clockin/clockout)
| [App's ackend REST API](https://github.com/pmeaney/timetracker/tree/master/src/server/) | Database communication including user authentication & business data CRUD


#### Important backend (NodeJS) packages include:

| Package      |  Purpose  
| -------------|-----------
| NodeJS       | Project main structure
| ExpressJS    | Project main structure
| bluebird     | Enhances asynchronous programming 
| CSURF        | API communication validation & form security (Http post & put requests)
| bcrypt       | Oneway password encryption in user authentication system (salt & hash)
| express-session | Storing temporary backend user communication information (sessions)
| KnexJS | Interacting with PostgreSQL database via KnexJS's javascript API, improving security and reducing complexity
| multer | File uploads

#### Other important project platforms:

| Platform      |  Purpose  
|---------------|-----------
| Postgres      | SQL Database
| Nginx         | Web server software (reverse proxy)
| Ubuntu Server | Server operating system (Open source linux distribution)

<!-- 
![alt screenshot1](https://github.com/pmeaney/timetracker/blob/master/src/server/public/screenshots/1.png)

![alt screenshot2](https://github.com/pmeaney/timetracker/blob/master/src/server/public/screenshots/2.png)

![alt screenshot3](https://github.com/pmeaney/timetracker/blob/master/src/server/public/screenshots/3.png)

![alt screenshot4](https://github.com/pmeaney/timetracker/blob/master/src/server/public/screenshots/4.png)

![alt screenshot5](https://github.com/pmeaney/timetracker/blob/master/src/server/public/screenshots/5.png) -->
