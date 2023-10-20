import express from 'express'
import {getProducts, loginUser, loginWithGoogle, logoutUser, refresh, registerUser, setUser} from '../controllers/authController.js'
//import { authenticateUser } from '../middleware/auth.js'

const router = express.Router()

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route('/user').get(setUser)
router.route('/google').post(loginWithGoogle)
router.route('/logout').get(logoutUser)
router.route("/products").get(getProducts)
router.route("/refresh").get(refresh)

export default router