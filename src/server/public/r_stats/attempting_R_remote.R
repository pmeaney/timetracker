# Need to output the final data as json
# try jsonlite::write_json()
# https://stackoverflow.com/questions/25550711/convert-data-frame-to-json
needs(dplyr)

setwd('/home/pat/apps/timetracker/public/r_stats/')

# curr_wd <- getwd()
# print(curr_wd)

AustinData <- read.csv("/home/pat/apps/timetracker/public/r_stats/AustinData_062918.csv")


 
AustinTrainingDataset <- sample_n(AustinData, 30, replace = FALSE)

AustinTestDataset <- subset(AustinData, !(zipcode %in% AustinTrainingDataset$zipcode))

AustinTestDataset <- data.frame(MedianHouseholdIncome = AustinTestDataset$MedianHouseholdIncome,
                                MedianRent = AustinTestDataset$MedianRent,
                                PopulationBelowPovertyLevel = AustinTestDataset$PopulationBelowPovertyLevel,
                                assaultPerCapita = AustinTestDataset$assault_perCapita,
                                robberyPerCapita = AustinTestDataset$robbery_perCapita,
                                burglaryPerCapita = AustinTestDataset$burglary_perCapita,
                                theftPerCapita = AustinTestDataset$theft_perCapita
)


multipleregression_train_assault<-lm(
  assault_perCapita ~ 
    MedianHouseholdIncome * MedianRent * PopulationBelowPovertyLevel, 
  data=AustinTrainingDataset )
# summary(multipleregression_train_assault)
# VIF(multipleregression_train_assault)

avgCI_assault_df <- data.frame(predict.lm(multipleregression_train_assault, newdata=AustinTestDataset, interval="confidence"))
test_assultPerCapita_df <- data.frame(AustinTestDataset$assaultPerCapita)

# print(test_assultPerCapita_df)
final_df = cbind(avgCI_assault_df,test_assultPerCapita_df)


print(final_df)


