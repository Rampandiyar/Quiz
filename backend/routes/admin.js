import express from "express";
import { adminRegister, adminLogin, adminLogout, adminUpdateProfile, adminSendEmail, adminResetPassword, adminGet, adminEnableTest } from "../controller/admin.controller.js";

const router = express.Router();

router.post('/ad-register', adminRegister);
router.post('/ad-login', adminLogin);
router.post('/ad-logout', adminLogout);
router.put('/ad-update/:id', adminUpdateProfile); // Note the change here
router.post('/ad-send-email', adminSendEmail);
router.post('/enable-test', adminEnableTest);

router.post('/ad-reset-password', adminResetPassword);
router.get('/ad-get/:adminId', adminGet);

export default router;
