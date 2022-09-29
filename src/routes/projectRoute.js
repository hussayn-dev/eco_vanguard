const router = require("express").Router()
const project = require('../controllers/project.controller')
const {authenticateUser, authorizeRoles} = require("../middlewares/auth-workflow")



router.post('/create', authenticateUser,authorizeRoles("admin"), project.createProject)
router.get('/allProjects', project.getAll)
router.route('/:id')
.get(project.getOne)
.patch(authenticateUser, authorizeRoles("admin"), project.editOne)
.delete(authenticateUser, authorizeRoles("admin"), project.deleteOne)


router.patch('/avatar/:id',authenticateUser,authorizeRoles("admin"), project.editImage)
router.delete('/avatar/:id',authenticateUser,authorizeRoles("admin"),project.deleteImage)


module.exports = router