const fs = require('fs');
const path = require('path');

module.exports.listApps = fs.readFileSync(path.join(__dirname, 'listApps.ts'), 'utf8');
module.exports.getApps = fs.readFileSync(path.join(__dirname, 'getApps.ts'), 'utf8');
module.exports.listAuthenticator = fs.readFileSync(path.join(__dirname, 'listAuthenticator.ts'), 'utf8');
module.exports.getAuthenticator = fs.readFileSync(path.join(__dirname, 'getAuthenticator.ts'), 'utf8');
module.exports.listBreach = fs.readFileSync(path.join(__dirname, 'listBreach.ts'), 'utf8');
module.exports.listBreachLast2Days = fs.readFileSync(path.join(__dirname, 'listBreachLast2Days.ts'), 'utf8');
module.exports.listBreachLast2DaysApp = fs.readFileSync(path.join(__dirname, 'listBreachLast2DaysApp.ts'), 'utf8');
module.exports.generaReportBreach = fs.readFileSync(path.join(__dirname, 'generaReportBreach.ts'), 'utf8');
module.exports.generaReportBreachPDF = fs.readFileSync(path.join(__dirname, 'generaReportBreachPDF.ts'), 'utf8');
module.exports.getBreach = fs.readFileSync(path.join(__dirname, 'getBreach.ts'), 'utf8');
module.exports.getClientState = fs.readFileSync(path.join(__dirname, 'getClientState.ts'), 'utf8');
module.exports.listContact = fs.readFileSync(path.join(__dirname, 'listContact.ts'), 'utf8');
module.exports.getContact = fs.readFileSync(path.join(__dirname, 'getContact.ts'), 'utf8');
module.exports.getEventContact = fs.readFileSync(path.join(__dirname, 'getEventContact.ts'), 'utf8');
module.exports.listContactWithOutVerify = fs.readFileSync(path.join(__dirname, 'listContactWithOutVerify.ts'), 'utf8');
module.exports.listDevice = fs.readFileSync(path.join(__dirname, 'listDevice.ts'), 'utf8');
module.exports.listDeviceIfExists = fs.readFileSync(path.join(__dirname, 'listDeviceIfExists.ts'), 'utf8');
module.exports.listAvailableDevices = fs.readFileSync(path.join(__dirname, 'listAvailableDevices.ts'), 'utf8');
module.exports.getDevice = fs.readFileSync(path.join(__dirname, 'getDevice.ts'), 'utf8');
module.exports.getLocationBySerialNumber = fs.readFileSync(path.join(__dirname, 'getLocationBySerialNumber.ts'), 'utf8');
module.exports.listEvent = fs.readFileSync(path.join(__dirname, 'listEvent.ts'), 'utf8');
module.exports.listEventHistory = fs.readFileSync(path.join(__dirname, 'listEventHistory.ts'), 'utf8');
module.exports.listEventActive = fs.readFileSync(path.join(__dirname, 'listEventActive.ts'), 'utf8');
module.exports.listAllEventsActive = fs.readFileSync(path.join(__dirname, 'listAllEventsActive.ts'), 'utf8');
module.exports.getEvent = fs.readFileSync(path.join(__dirname, 'getEvent.ts'), 'utf8');
module.exports.listEventByLocation = fs.readFileSync(path.join(__dirname, 'listEventByLocation.ts'), 'utf8');
module.exports.listEventsYesterday = fs.readFileSync(path.join(__dirname, 'listEventsYesterday.ts'), 'utf8');
module.exports.listEventsToday = fs.readFileSync(path.join(__dirname, 'listEventsToday.ts'), 'utf8');
module.exports.listEventsTomorrow = fs.readFileSync(path.join(__dirname, 'listEventsTomorrow.ts'), 'utf8');
module.exports.listEventExpress = fs.readFileSync(path.join(__dirname, 'listEventExpress.ts'), 'utf8');
module.exports.getEventExpress = fs.readFileSync(path.join(__dirname, 'getEventExpress.ts'), 'utf8');
module.exports.listGalery = fs.readFileSync(path.join(__dirname, 'listGalery.ts'), 'utf8');
module.exports.getGalery = fs.readFileSync(path.join(__dirname, 'getGalery.ts'), 'utf8');
module.exports.analythicsAttemptsApp = fs.readFileSync(path.join(__dirname, 'analythicsAttemptsApp.ts'), 'utf8');
module.exports.generalAnalythics = fs.readFileSync(path.join(__dirname, 'generalAnalythics.ts'), 'utf8');
module.exports.analythicsAttempts = fs.readFileSync(path.join(__dirname, 'analythicsAttempts.ts'), 'utf8');
module.exports.analythicsAttemptsByLocation = fs.readFileSync(path.join(__dirname, 'analythicsAttemptsByLocation.ts'), 'utf8');
module.exports.listGroupWorker = fs.readFileSync(path.join(__dirname, 'listGroupWorker.ts'), 'utf8');
module.exports.listGroupWorkerIfExist = fs.readFileSync(path.join(__dirname, 'listGroupWorkerIfExist.ts'), 'utf8');
module.exports.getGroupWorker = fs.readFileSync(path.join(__dirname, 'getGroupWorker.ts'), 'utf8');
module.exports.listHistoryUser = fs.readFileSync(path.join(__dirname, 'listHistoryUser.ts'), 'utf8');
module.exports.getHistoryUser = fs.readFileSync(path.join(__dirname, 'getHistoryUser.ts'), 'utf8');
module.exports.listInvitationEvent = fs.readFileSync(path.join(__dirname, 'listInvitationEvent.ts'), 'utf8');
module.exports.getInvitationEvent = fs.readFileSync(path.join(__dirname, 'getInvitationEvent.ts'), 'utf8');
module.exports.listInvitationEventByEvent = fs.readFileSync(path.join(__dirname, 'listInvitationEventByEvent.ts'), 'utf8');
module.exports.listLocation = fs.readFileSync(path.join(__dirname, 'listLocation.ts'), 'utf8');
module.exports.listLocationActive = fs.readFileSync(path.join(__dirname, 'listLocationActive.ts'), 'utf8');
module.exports.getLocation = fs.readFileSync(path.join(__dirname, 'getLocation.ts'), 'utf8');
module.exports.getLocationSecurity = fs.readFileSync(path.join(__dirname, 'getLocationSecurity.ts'), 'utf8');
module.exports.getLocationsByMaster = fs.readFileSync(path.join(__dirname, 'getLocationsByMaster.ts'), 'utf8');
module.exports.getAllToSecurity = fs.readFileSync(path.join(__dirname, 'getAllToSecurity.ts'), 'utf8');
module.exports.generateExcelSecurity = fs.readFileSync(path.join(__dirname, 'generateExcelSecurity.ts'), 'utf8');
module.exports.generatePDFSecurity = fs.readFileSync(path.join(__dirname, 'generatePDFSecurity.ts'), 'utf8');
module.exports.listLocationAttempt = fs.readFileSync(path.join(__dirname, 'listLocationAttempt.ts'), 'utf8');
module.exports.getLocationAttempt = fs.readFileSync(path.join(__dirname, 'getLocationAttempt.ts'), 'utf8');
module.exports.listAttemptsToday = fs.readFileSync(path.join(__dirname, 'listAttemptsToday.ts'), 'utf8');
module.exports.listAttemptsYesterday = fs.readFileSync(path.join(__dirname, 'listAttemptsYesterday.ts'), 'utf8');
module.exports.listAttemptsMonthInternal = fs.readFileSync(path.join(__dirname, 'listAttemptsMonthInternal.ts'), 'utf8');
module.exports.listAttemptsAllInternal = fs.readFileSync(path.join(__dirname, 'listAttemptsAllInternal.ts'), 'utf8');
module.exports.listAttemptsMonthExternal = fs.readFileSync(path.join(__dirname, 'listAttemptsMonthExternal.ts'), 'utf8');
module.exports.listAttemptsAllExternal = fs.readFileSync(path.join(__dirname, 'listAttemptsAllExternal.ts'), 'utf8');
module.exports.listLocationEntries = fs.readFileSync(path.join(__dirname, 'listLocationEntries.ts'), 'utf8');
module.exports.listLocationEntriesPaginated = fs.readFileSync(path.join(__dirname, 'listLocationEntriesPaginated.ts'), 'utf8');
module.exports.getLocationEntriesByLocation = fs.readFileSync(path.join(__dirname, 'getLocationEntriesByLocation.ts'), 'utf8');
module.exports.filterLocationEntries = fs.readFileSync(path.join(__dirname, 'filterLocationEntries.ts'), 'utf8');
module.exports.filterLocationEntriesSecurity = fs.readFileSync(path.join(__dirname, 'filterLocationEntriesSecurity.ts'), 'utf8');
module.exports.generateReportLocationEntries = fs.readFileSync(path.join(__dirname, 'generateReportLocationEntries.ts'), 'utf8');
module.exports.generateReportLocationEntriesSecurity = fs.readFileSync(path.join(__dirname, 'generateReportLocationEntriesSecurity.ts'), 'utf8');
module.exports.listLocationEntriesExternal = fs.readFileSync(path.join(__dirname, 'listLocationEntriesExternal.ts'), 'utf8');
module.exports.firstLogin = fs.readFileSync(path.join(__dirname, 'firstLogin.ts'), 'utf8');
module.exports.verifyKey = fs.readFileSync(path.join(__dirname, 'verifyKey.ts'), 'utf8');
module.exports.listMasterLocation = fs.readFileSync(path.join(__dirname, 'listMasterLocation.ts'), 'utf8');
module.exports.listMasterLocationActive = fs.readFileSync(path.join(__dirname, 'listMasterLocationActive.ts'), 'utf8');
module.exports.getMasterLocation = fs.readFileSync(path.join(__dirname, 'getMasterLocation.ts'), 'utf8');
module.exports.listPrivilege = fs.readFileSync(path.join(__dirname, 'listPrivilege.ts'), 'utf8');
module.exports.getPrivilege = fs.readFileSync(path.join(__dirname, 'getPrivilege.ts'), 'utf8');
module.exports.listRisk = fs.readFileSync(path.join(__dirname, 'listRisk.ts'), 'utf8');
module.exports.getRisk = fs.readFileSync(path.join(__dirname, 'getRisk.ts'), 'utf8');
module.exports.listRiskReset = fs.readFileSync(path.join(__dirname, 'listRiskReset.ts'), 'utf8');
module.exports.getRiskReset = fs.readFileSync(path.join(__dirname, 'getRiskReset.ts'), 'utf8');
module.exports.listSection = fs.readFileSync(path.join(__dirname, 'listSection.ts'), 'utf8');
module.exports.getSection = fs.readFileSync(path.join(__dirname, 'getSection.ts'), 'utf8');
module.exports.listTestMRZ = fs.readFileSync(path.join(__dirname, 'listTestMRZ.ts'), 'utf8');
module.exports.listTimeZone = fs.readFileSync(path.join(__dirname, 'listTimeZone.ts'), 'utf8');
module.exports.getTimeZone = fs.readFileSync(path.join(__dirname, 'getTimeZone.ts'), 'utf8');
module.exports.listUser = fs.readFileSync(path.join(__dirname, 'listUser.ts'), 'utf8');
module.exports.getUser = fs.readFileSync(path.join(__dirname, 'getUser.ts'), 'utf8');
module.exports.getUsersAdmin = fs.readFileSync(path.join(__dirname, 'getUsersAdmin.ts'), 'utf8');
module.exports.listAllUsers = fs.readFileSync(path.join(__dirname, 'listAllUsers.ts'), 'utf8');
module.exports.getUserHost = fs.readFileSync(path.join(__dirname, 'getUserHost.ts'), 'utf8');
module.exports.verifyKeyUser = fs.readFileSync(path.join(__dirname, 'verifyKeyUser.ts'), 'utf8');
module.exports.countUserWorker = fs.readFileSync(path.join(__dirname, 'countUserWorker.ts'), 'utf8');
module.exports.getUsersSecurity = fs.readFileSync(path.join(__dirname, 'getUsersSecurity.ts'), 'utf8');
module.exports.listVisitorBrand = fs.readFileSync(path.join(__dirname, 'listVisitorBrand.ts'), 'utf8');
module.exports.getVisitorBrand = fs.readFileSync(path.join(__dirname, 'getVisitorBrand.ts'), 'utf8');
module.exports.getVisitorBrandByCategory = fs.readFileSync(path.join(__dirname, 'getVisitorBrandByCategory.ts'), 'utf8');
module.exports.listVisitorCategory = fs.readFileSync(path.join(__dirname, 'listVisitorCategory.ts'), 'utf8');
module.exports.getVisitorCategory = fs.readFileSync(path.join(__dirname, 'getVisitorCategory.ts'), 'utf8');
module.exports.listVisitorPlace = fs.readFileSync(path.join(__dirname, 'listVisitorPlace.ts'), 'utf8');
module.exports.getVisitorPlace = fs.readFileSync(path.join(__dirname, 'getVisitorPlace.ts'), 'utf8');
module.exports.listWorker = fs.readFileSync(path.join(__dirname, 'listWorker.ts'), 'utf8');
module.exports.getWorker = fs.readFileSync(path.join(__dirname, 'getWorker.ts'), 'utf8');
