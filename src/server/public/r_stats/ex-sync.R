# needs(magrittr)
# set.seed(512)

# curr_wd <- getwd()
# print(curr_wd)

# AustinData <- read.csv("/Applications/MAMP/htdocs/node_projects_individualRepos/timetracker-app/expressKnexPostgres-timetracker/public/r_stats/StatsProject_AustinData.csv")
# austin_data_head <- head(AustinData, 5)
# # print(austin_data_head)


# AustinTrainingDataset <- sample_n(AustinData, 30, replace = FALSE)

# AustinTestDataset <- subset(AustinData, !(zipcode %in% AustinTrainingDataset$zipcode))

# AustinTestDataset <- data.frame(MedianHouseholdIncome = AustinTestDataset$MedianHouseholdIncome,
#                                 MedianRent = AustinTestDataset$MedianRent,
#                                 PopulationBelowPovertyLevel = AustinTestDataset$PopulationBelowPovertyLevel,
#                                 assaultPerCapita = AustinTestDataset$assault_perCapita,
#                                 robberyPerCapita = AustinTestDataset$robbery_perCapita,
#                                 burglaryPerCapita = AustinTestDataset$burglary_perCapita,
#                                 theftPerCapita = AustinTestDataset$theft_perCapita
# )

# AustinTestDataset_head  <- head(AustinTestDataset, 5)
# print(AustinTestDataset_head)
# do.call(print, curr_wd)
# do.call(rep, input) %>% 
#   strsplit(NULL) %>% 
#   sapply(sample) %>% 
#   apply(2, paste, collapse = "")