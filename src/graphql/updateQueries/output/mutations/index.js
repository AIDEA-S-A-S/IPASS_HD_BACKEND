const fs = require('fs');
const path = require('path');

module.exports.createApps = fs.readFileSync(path.join(__dirname, 'createApps.ts'), 'utf8');
module.exports.updateApps = fs.readFileSync(path.join(__dirname, 'updateApps.ts'), 'utf8');
module.exports.deleteApps = fs.readFileSync(path.join(__dirname, 'deleteApps.ts'), 'utf8');
module.exports.deleteAppsAll = fs.readFileSync(path.join(__dirname, 'deleteAppsAll.ts'), 'utf8');
module.exports.createAuthenticator = fs.readFileSync(path.join(__dirname, 'createAuthenticator.ts'), 'utf8');
module.exports.generateExcelAuthenticator = fs.readFileSync(path.join(__dirname, 'generateExcelAuthenticator.ts'), 'utf8');
module.exports.generatePDFAuthenticator = fs.readFileSync(path.join(__dirname, 'generatePDFAuthenticator.ts'), 'utf8');
module.exports.updateAuthenticator = fs.readFileSync(path.join(__dirname, 'updateAuthenticator.ts'), 'utf8');
module.exports.deleteAuthenticator = fs.readFileSync(path.join(__dirname, 'deleteAuthenticator.ts'), 'utf8');
module.exports.deleteAuthenticatorAll = fs.readFileSync(path.join(__dirname, 'deleteAuthenticatorAll.ts'), 'utf8');
module.exports.createBreach = fs.readFileSync(path.join(__dirname, 'createBreach.ts'), 'utf8');
module.exports.updateBreach = fs.readFileSync(path.join(__dirname, 'updateBreach.ts'), 'utf8');
module.exports.unBanUser = fs.readFileSync(path.join(__dirname, 'unBanUser.ts'), 'utf8');
module.exports.deleteBreach = fs.readFileSync(path.join(__dirname, 'deleteBreach.ts'), 'utf8');
module.exports.deleteBreachAll = fs.readFileSync(path.join(__dirname, 'deleteBreachAll.ts'), 'utf8');
module.exports.loginClientWa = fs.readFileSync(path.join(__dirname, 'loginClientWa.ts'), 'utf8');
module.exports.sendVerification = fs.readFileSync(path.join(__dirname, 'sendVerification.ts'), 'utf8');
module.exports.createContact = fs.readFileSync(path.join(__dirname, 'createContact.ts'), 'utf8');
module.exports.updateContact = fs.readFileSync(path.join(__dirname, 'updateContact.ts'), 'utf8');
module.exports.deleteContact = fs.readFileSync(path.join(__dirname, 'deleteContact.ts'), 'utf8');
module.exports.deleteContactAll = fs.readFileSync(path.join(__dirname, 'deleteContactAll.ts'), 'utf8');
module.exports.sendDataVerification = fs.readFileSync(path.join(__dirname, 'sendDataVerification.ts'), 'utf8');
module.exports.sendDataVerificationPass = fs.readFileSync(path.join(__dirname, 'sendDataVerificationPass.ts'), 'utf8');
module.exports.sendDataVerificationPDF = fs.readFileSync(path.join(__dirname, 'sendDataVerificationPDF.ts'), 'utf8');
module.exports.verifyContact = fs.readFileSync(path.join(__dirname, 'verifyContact.ts'), 'utf8');
module.exports.uploadMRZ = fs.readFileSync(path.join(__dirname, 'uploadMRZ.ts'), 'utf8');
module.exports.verifyPhoto = fs.readFileSync(path.join(__dirname, 'verifyPhoto.ts'), 'utf8');
module.exports.createDevice = fs.readFileSync(path.join(__dirname, 'createDevice.ts'), 'utf8');
module.exports.updateDevice = fs.readFileSync(path.join(__dirname, 'updateDevice.ts'), 'utf8');
module.exports.deleteDevice = fs.readFileSync(path.join(__dirname, 'deleteDevice.ts'), 'utf8');
module.exports.deleteDeviceAll = fs.readFileSync(path.join(__dirname, 'deleteDeviceAll.ts'), 'utf8');
module.exports.createEvent = fs.readFileSync(path.join(__dirname, 'createEvent.ts'), 'utf8');
module.exports.updateEvent = fs.readFileSync(path.join(__dirname, 'updateEvent.ts'), 'utf8');
module.exports.deleteEvent = fs.readFileSync(path.join(__dirname, 'deleteEvent.ts'), 'utf8');
module.exports.deleteEventChangeStatus = fs.readFileSync(path.join(__dirname, 'deleteEventChangeStatus.ts'), 'utf8');
module.exports.deleteEventAll = fs.readFileSync(path.join(__dirname, 'deleteEventAll.ts'), 'utf8');
module.exports.eventacceptReject = fs.readFileSync(path.join(__dirname, 'eventacceptReject.ts'), 'utf8');
module.exports.createEventExpress = fs.readFileSync(path.join(__dirname, 'createEventExpress.ts'), 'utf8');
module.exports.updateEventExpress = fs.readFileSync(path.join(__dirname, 'updateEventExpress.ts'), 'utf8');
module.exports.deleteEventExpress = fs.readFileSync(path.join(__dirname, 'deleteEventExpress.ts'), 'utf8');
module.exports.deleteEventExpressAll = fs.readFileSync(path.join(__dirname, 'deleteEventExpressAll.ts'), 'utf8');
module.exports.acceptEventExpress = fs.readFileSync(path.join(__dirname, 'acceptEventExpress.ts'), 'utf8');
module.exports.denyEventExpress = fs.readFileSync(path.join(__dirname, 'denyEventExpress.ts'), 'utf8');
module.exports.sendQREventExpress = fs.readFileSync(path.join(__dirname, 'sendQREventExpress.ts'), 'utf8');
module.exports.sendDataVerificationEventExress = fs.readFileSync(path.join(__dirname, 'sendDataVerificationEventExress.ts'), 'utf8');
module.exports.sendDataVerificationPDFEventExpress = fs.readFileSync(path.join(__dirname, 'sendDataVerificationPDFEventExpress.ts'), 'utf8');
module.exports.createGalery = fs.readFileSync(path.join(__dirname, 'createGalery.ts'), 'utf8');
module.exports.updateGalery = fs.readFileSync(path.join(__dirname, 'updateGalery.ts'), 'utf8');
module.exports.deleteGalery = fs.readFileSync(path.join(__dirname, 'deleteGalery.ts'), 'utf8');
module.exports.deleteGaleryAll = fs.readFileSync(path.join(__dirname, 'deleteGaleryAll.ts'), 'utf8');
module.exports.createGroupWorker = fs.readFileSync(path.join(__dirname, 'createGroupWorker.ts'), 'utf8');
module.exports.updateGroupWorker = fs.readFileSync(path.join(__dirname, 'updateGroupWorker.ts'), 'utf8');
module.exports.deleteGroupWorker = fs.readFileSync(path.join(__dirname, 'deleteGroupWorker.ts'), 'utf8');
module.exports.deleteGroupWorkerAll = fs.readFileSync(path.join(__dirname, 'deleteGroupWorkerAll.ts'), 'utf8');
module.exports.createHistoryUser = fs.readFileSync(path.join(__dirname, 'createHistoryUser.ts'), 'utf8');
module.exports.deleteHistoryUser = fs.readFileSync(path.join(__dirname, 'deleteHistoryUser.ts'), 'utf8');
module.exports.deleteHistoryUserAll = fs.readFileSync(path.join(__dirname, 'deleteHistoryUserAll.ts'), 'utf8');
module.exports.createInvitationEvent = fs.readFileSync(path.join(__dirname, 'createInvitationEvent.ts'), 'utf8');
module.exports.generateHostQR = fs.readFileSync(path.join(__dirname, 'generateHostQR.ts'), 'utf8');
module.exports.updateInvitationEvent = fs.readFileSync(path.join(__dirname, 'updateInvitationEvent.ts'), 'utf8');
module.exports.deleteInvitationEvent = fs.readFileSync(path.join(__dirname, 'deleteInvitationEvent.ts'), 'utf8');
module.exports.deleteInvitationEventAll = fs.readFileSync(path.join(__dirname, 'deleteInvitationEventAll.ts'), 'utf8');
module.exports.createLocation = fs.readFileSync(path.join(__dirname, 'createLocation.ts'), 'utf8');
module.exports.updateLocation = fs.readFileSync(path.join(__dirname, 'updateLocation.ts'), 'utf8');
module.exports.deleteLocation = fs.readFileSync(path.join(__dirname, 'deleteLocation.ts'), 'utf8');
module.exports.deleteLocationChangeStatus = fs.readFileSync(path.join(__dirname, 'deleteLocationChangeStatus.ts'), 'utf8');
module.exports.deleteLocationAll = fs.readFileSync(path.join(__dirname, 'deleteLocationAll.ts'), 'utf8');
module.exports.verifyInputQR = fs.readFileSync(path.join(__dirname, 'verifyInputQR.ts'), 'utf8');
module.exports.createLocationAttempt = fs.readFileSync(path.join(__dirname, 'createLocationAttempt.ts'), 'utf8');
module.exports.updateLocationAttempt = fs.readFileSync(path.join(__dirname, 'updateLocationAttempt.ts'), 'utf8');
module.exports.deleteLocationAttempt = fs.readFileSync(path.join(__dirname, 'deleteLocationAttempt.ts'), 'utf8');
module.exports.deleteLocationAttemptAll = fs.readFileSync(path.join(__dirname, 'deleteLocationAttemptAll.ts'), 'utf8');
module.exports.generatePDFLocationEntries = fs.readFileSync(path.join(__dirname, 'generatePDFLocationEntries.ts'), 'utf8');
module.exports.newEntry = fs.readFileSync(path.join(__dirname, 'newEntry.ts'), 'utf8');
module.exports.cleanNoEvent = fs.readFileSync(path.join(__dirname, 'cleanNoEvent.ts'), 'utf8');
module.exports.deleteLocationEntry = fs.readFileSync(path.join(__dirname, 'deleteLocationEntry.ts'), 'utf8');
module.exports.deleteLocationEntriesAll = fs.readFileSync(path.join(__dirname, 'deleteLocationEntriesAll.ts'), 'utf8');
module.exports.createFirstUser = fs.readFileSync(path.join(__dirname, 'createFirstUser.ts'), 'utf8');
module.exports.confirmUser = fs.readFileSync(path.join(__dirname, 'confirmUser.ts'), 'utf8');
module.exports.login = fs.readFileSync(path.join(__dirname, 'login.ts'), 'utf8');
module.exports.loginApp = fs.readFileSync(path.join(__dirname, 'loginApp.ts'), 'utf8');
module.exports.confirmLogin = fs.readFileSync(path.join(__dirname, 'confirmLogin.ts'), 'utf8');
module.exports.confirmSignUp = fs.readFileSync(path.join(__dirname, 'confirmSignUp.ts'), 'utf8');
module.exports.forgotPassword = fs.readFileSync(path.join(__dirname, 'forgotPassword.ts'), 'utf8');
module.exports.changePassword = fs.readFileSync(path.join(__dirname, 'changePassword.ts'), 'utf8');
module.exports.createDummyData = fs.readFileSync(path.join(__dirname, 'createDummyData.ts'), 'utf8');
module.exports.createMasterLocation = fs.readFileSync(path.join(__dirname, 'createMasterLocation.ts'), 'utf8');
module.exports.updateMasterLocation = fs.readFileSync(path.join(__dirname, 'updateMasterLocation.ts'), 'utf8');
module.exports.deleteMasterLocation = fs.readFileSync(path.join(__dirname, 'deleteMasterLocation.ts'), 'utf8');
module.exports.deleteMasterLocationChangeStatus = fs.readFileSync(path.join(__dirname, 'deleteMasterLocationChangeStatus.ts'), 'utf8');
module.exports.deleteMasterLocationAll = fs.readFileSync(path.join(__dirname, 'deleteMasterLocationAll.ts'), 'utf8');
module.exports.uploadPDF = fs.readFileSync(path.join(__dirname, 'uploadPDF.ts'), 'utf8');
module.exports.createPrivilege = fs.readFileSync(path.join(__dirname, 'createPrivilege.ts'), 'utf8');
module.exports.updatePrivilege = fs.readFileSync(path.join(__dirname, 'updatePrivilege.ts'), 'utf8');
module.exports.deletePrivilege = fs.readFileSync(path.join(__dirname, 'deletePrivilege.ts'), 'utf8');
module.exports.deletePrivilegeAll = fs.readFileSync(path.join(__dirname, 'deletePrivilegeAll.ts'), 'utf8');
module.exports.createRisk = fs.readFileSync(path.join(__dirname, 'createRisk.ts'), 'utf8');
module.exports.updateRisk = fs.readFileSync(path.join(__dirname, 'updateRisk.ts'), 'utf8');
module.exports.deleteRisk = fs.readFileSync(path.join(__dirname, 'deleteRisk.ts'), 'utf8');
module.exports.deleteRiskAll = fs.readFileSync(path.join(__dirname, 'deleteRiskAll.ts'), 'utf8');
module.exports.callRisk = fs.readFileSync(path.join(__dirname, 'callRisk.ts'), 'utf8');
module.exports.createRiskReset = fs.readFileSync(path.join(__dirname, 'createRiskReset.ts'), 'utf8');
module.exports.updateRiskReset = fs.readFileSync(path.join(__dirname, 'updateRiskReset.ts'), 'utf8');
module.exports.deleteRiskReset = fs.readFileSync(path.join(__dirname, 'deleteRiskReset.ts'), 'utf8');
module.exports.deleteRiskResetAll = fs.readFileSync(path.join(__dirname, 'deleteRiskResetAll.ts'), 'utf8');
module.exports.createSection = fs.readFileSync(path.join(__dirname, 'createSection.ts'), 'utf8');
module.exports.updateSection = fs.readFileSync(path.join(__dirname, 'updateSection.ts'), 'utf8');
module.exports.deleteSection = fs.readFileSync(path.join(__dirname, 'deleteSection.ts'), 'utf8');
module.exports.deleteSectionAll = fs.readFileSync(path.join(__dirname, 'deleteSectionAll.ts'), 'utf8');
module.exports.createTimeZone = fs.readFileSync(path.join(__dirname, 'createTimeZone.ts'), 'utf8');
module.exports.updateTimeZone = fs.readFileSync(path.join(__dirname, 'updateTimeZone.ts'), 'utf8');
module.exports.deleteTimeZone = fs.readFileSync(path.join(__dirname, 'deleteTimeZone.ts'), 'utf8');
module.exports.deleteTimeZoneAll = fs.readFileSync(path.join(__dirname, 'deleteTimeZoneAll.ts'), 'utf8');
module.exports.createUser = fs.readFileSync(path.join(__dirname, 'createUser.ts'), 'utf8');
module.exports.updateUser = fs.readFileSync(path.join(__dirname, 'updateUser.ts'), 'utf8');
module.exports.deleteUser = fs.readFileSync(path.join(__dirname, 'deleteUser.ts'), 'utf8');
module.exports.addKeyUser = fs.readFileSync(path.join(__dirname, 'addKeyUser.ts'), 'utf8');
module.exports.setPushToken = fs.readFileSync(path.join(__dirname, 'setPushToken.ts'), 'utf8');
module.exports.resetToken = fs.readFileSync(path.join(__dirname, 'resetToken.ts'), 'utf8');
module.exports.deleteUserAll = fs.readFileSync(path.join(__dirname, 'deleteUserAll.ts'), 'utf8');
module.exports.createVisitorBrand = fs.readFileSync(path.join(__dirname, 'createVisitorBrand.ts'), 'utf8');
module.exports.updateVisitorBrand = fs.readFileSync(path.join(__dirname, 'updateVisitorBrand.ts'), 'utf8');
module.exports.deleteVisitorBrand = fs.readFileSync(path.join(__dirname, 'deleteVisitorBrand.ts'), 'utf8');
module.exports.deleteVisitorBrandAll = fs.readFileSync(path.join(__dirname, 'deleteVisitorBrandAll.ts'), 'utf8');
module.exports.createVisitorCategory = fs.readFileSync(path.join(__dirname, 'createVisitorCategory.ts'), 'utf8');
module.exports.updateVisitorCategory = fs.readFileSync(path.join(__dirname, 'updateVisitorCategory.ts'), 'utf8');
module.exports.deleteVisitorCategory = fs.readFileSync(path.join(__dirname, 'deleteVisitorCategory.ts'), 'utf8');
module.exports.deleteVisitorCategoryAll = fs.readFileSync(path.join(__dirname, 'deleteVisitorCategoryAll.ts'), 'utf8');
module.exports.createVisitorPlace = fs.readFileSync(path.join(__dirname, 'createVisitorPlace.ts'), 'utf8');
module.exports.updateVisitorPlace = fs.readFileSync(path.join(__dirname, 'updateVisitorPlace.ts'), 'utf8');
module.exports.deleteVisitorPlace = fs.readFileSync(path.join(__dirname, 'deleteVisitorPlace.ts'), 'utf8');
module.exports.deleteVisitorPlaceAll = fs.readFileSync(path.join(__dirname, 'deleteVisitorPlaceAll.ts'), 'utf8');
module.exports.createWorker = fs.readFileSync(path.join(__dirname, 'createWorker.ts'), 'utf8');
module.exports.signUpWorker = fs.readFileSync(path.join(__dirname, 'signUpWorker.ts'), 'utf8');
module.exports.loginWorker = fs.readFileSync(path.join(__dirname, 'loginWorker.ts'), 'utf8');
module.exports.loginAppWorker = fs.readFileSync(path.join(__dirname, 'loginAppWorker.ts'), 'utf8');
module.exports.generateNewTemporalQR = fs.readFileSync(path.join(__dirname, 'generateNewTemporalQR.ts'), 'utf8');
module.exports.generateNewPermanentQR = fs.readFileSync(path.join(__dirname, 'generateNewPermanentQR.ts'), 'utf8');
module.exports.deleteTemporalQR = fs.readFileSync(path.join(__dirname, 'deleteTemporalQR.ts'), 'utf8');
module.exports.createMassiveWorker = fs.readFileSync(path.join(__dirname, 'createMassiveWorker.ts'), 'utf8');
module.exports.updateWorker = fs.readFileSync(path.join(__dirname, 'updateWorker.ts'), 'utf8');
module.exports.deleteWorker = fs.readFileSync(path.join(__dirname, 'deleteWorker.ts'), 'utf8');
module.exports.deleteWorkerAll = fs.readFileSync(path.join(__dirname, 'deleteWorkerAll.ts'), 'utf8');
