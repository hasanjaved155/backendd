const express = require('express');

const { registerController, loginController, testController, forgotPasswordController } = require('../controllers/authController');
const { requireSignIn, isAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', registerController);
router.post('/login', loginController);
router.post('/forgot-password', forgotPasswordController)
router.get("/test", requireSignIn, isAdmin, testController);

//protected route auth
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
})

//protected route auth-admin
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
})



module.exports = router;