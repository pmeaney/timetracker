setwd('/Applications/MAMP/htdocs/node_projects_individualRepos/timetracker-app/expressKnexPostgres-timetracker/public/r_stats/')

curr_wd <- getwd()
print(curr_wd)

AustinData <- read.csv("/Applications/MAMP/htdocs/node_projects_individualRepos/timetracker-app/expressKnexPostgres-timetracker/public/r_stats/AustinData_062918.csv")

austin_data_head <- head(AustinData, 5)
print(austin_data_head)
# View(austin_data_head)
# 
# 
AustinTrainingDataset <- sample_n(AustinData, 30, replace = FALSE)

AustinTestDataset <- subset(AustinData, !(zipcode %in% AustinTrainingDataset$zipcode))
View(AustinTestDataset)
AustinTestDataset <- data.frame(MedianHouseholdIncome = AustinTestDataset$MedianHouseholdIncome,
                                MedianRent = AustinTestDataset$MedianRent,
                                PopulationBelowPovertyLevel = AustinTestDataset$PopulationBelowPovertyLevel,
                                assaultPerCapita = AustinTestDataset$assault_perCapita,
                                robberyPerCapita = AustinTestDataset$robbery_perCapita,
                                burglaryPerCapita = AustinTestDataset$burglary_perCapita,
                                theftPerCapita = AustinTestDataset$theft_perCapita
)

# AustinTestDataset_head  <- head(AustinTestDataset, 5)
# print(AustinTestDataset_head)

multipleregression_train_assault<-lm(
  assault_perCapita ~ 
    MedianHouseholdIncome * MedianRent * PopulationBelowPovertyLevel, 
  data=AustinTrainingDataset )
summary(multipleregression_train_assault)
VIF(multipleregression_train_assault)

avgCI_assault <- predict.lm(multipleregression_train_assault, newdata=AustinTestDataset, interval="confidence")
avgCI_assault





# MLR summaries

# assault_perCapita as predicted by MedianHouseholdIncome * MedianRent * PopulationBelowPovertyLevel 
# multipleregression_assault<-lm(
#   AustinData$assault_perCapita ~ AustinData$MedianHouseholdIncome * AustinData$MedianRent * AustinData$PopulationBelowPovertyLevel )
# summary(multipleregression_assault)
# mlr_sum <- summary(multipleregression_assault)
# print(mlr_sum)
# 
# # burglary_perCapita as predicted by MedianHouseholdIncome * MedianRent * PopulationBelowPovertyLevel 
# multipleregression_burglary<-lm(
#   AustinData$burglary_perCapita ~ AustinData$MedianHouseholdIncome * AustinData$MedianRent * AustinData$PopulationBelowPovertyLevel )
# summary(multipleregression_burglary)
# 
# # robbery_perCapita as predicted by MedianHouseholdIncome * MedianRent * PopulationBelowPovertyLevel 
# multipleregression_robbery<-lm(
#   AustinData$robbery_perCapita ~ AustinData$MedianHouseholdIncome * AustinData$MedianRent * AustinData$PopulationBelowPovertyLevel )
# summary(multipleregression_robbery)
# 
# # homicide_perCapita as predicted by MedianHouseholdIncome * MedianRent * PopulationBelowPovertyLevel 
# multipleregression_homicid<-lm(
#   AustinData$homicide ~ AustinData$MedianHouseholdIncome * AustinData$MedianRent * AustinData$PopulationBelowPovertyLevel )
# summary(multipleregression_homicid)
# 
# # rape_perCapita as predicted by MedianHouseholdIncome * MedianRent * PopulationBelowPovertyLevel 
# multipleregression_rape<-lm(
#   AustinData$rape ~ AustinData$MedianHouseholdIncome * AustinData$MedianRent * AustinData$PopulationBelowPovertyLevel )
# summary(multipleregression_rape)
# 
# # theft_perCapita as predicted by MedianHouseholdIncome * MedianRent * PopulationBelowPovertyLevel 
# multipleregression_theft<-lm(
#   AustinData$theft ~ AustinData$MedianHouseholdIncome * AustinData$MedianRent * AustinData$PopulationBelowPovertyLevel )
# summary(multipleregression_theft)
