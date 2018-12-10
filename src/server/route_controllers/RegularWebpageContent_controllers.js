var R = require("r-script");
/* 
  ! Need to add the R script route and make sure it gets pinged corectly on front end
 */
const get_indexPage = (req, res) => {
  res.render('webcontent/technology_overview', 
  {
    env: process.env
  })
}

const local_data_statsProject = (req, res) => {

  /*  NOTE: Need to multiply each number by 1000, so that it's per 1000 people.
  also, if a datapoint is less than 0, make it 0. 
  Also, on the front end, make the sure load either replaces (replaceWith doesnt seem to work?)
  or only fires an append once on the html div that the d3 chart fills 

  IMPROVEMENT IDEAS:
  - In R: add in the zipcodes  Zipcode 
  - in D3: show zipcodes under as x-axis tick marks
  - add x-axis and y-axis grid lines
  - make y-axis adjust dynamically based, where max = max of all 4 columns, & vice versa for min.
  */

  var output = R("/Applications/MAMP/htdocs/node_projects_individualRepos/timetracker-app/expressKnexPostgres-timetracker/public/r_stats/attempting_R.R")
    .data()
    .callSync();

  res.status(200).json(output);

}

const remote_data_statsProject = (req, res) => {

  /*  NOTE: Need to multiply each number by 1000, so that it's per 1000 people.
  also, if a datapoint is less than 0, make it 0. 
  Also, on the front end, make the sure load either replaces (replaceWith doesnt seem to work?)
  or only fires an append once on the html div that the d3 chart fills */

  var output = R("/home/pat/apps/timetracker/public/r_stats/attempting_R_remote.R")
    .data()
    .callSync();

  res.status(200).json(output);

}

module.exports = {
  get_indexPage,
  local_data_statsProject,
  remote_data_statsProject,
}