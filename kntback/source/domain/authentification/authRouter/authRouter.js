const Router = require('express')
const router = new Router()
const controller = require('../authController/authController')
const {check} = require("express-validator")


router.post('/registration', [
    check('username', "username cannot be empty").notEmpty(),
    check('password', "password need to be 4-7 characters").isLength({min: 4, max: 10})
], controller.registration)
router.post('/login', controller.login)
router.get('/checkauth', controller.checkAuth)
router.post('/logout/:username', controller.logout)




module.exports = router