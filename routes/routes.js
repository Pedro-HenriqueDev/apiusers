const express = require("express")
const app = express();
const router = express.Router();
const HomeController = require("../controllers/HomeController");
const UserController = require("../controllers/UserController");
const AdminAuth = require("../middleware/AdmAuth");
const UserAuth = require("../middleware/UserAuth");

router.get('/', HomeController.index);

router.get("/user",AdminAuth, UserController.index);
router.get("/user/:id",AdminAuth, UserController.getUserById);
router.post('/user', UserController.create);
router.post("/recoverypass", UserController.recoveryPassword);
router.post("/changepassword", UserController.changePassword);
router.post("/login", UserController.login);
router.post("/validate",AdminAuth, HomeController.validate)
router.post("/validate-user",UserAuth, HomeController.validateUser);


router.put("/user",AdminAuth, UserController.edit);
router.delete("/user/:id",AdminAuth, UserController.delete);

module.exports = router;