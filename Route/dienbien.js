const express = require('express')
const router = express.Router()
const thuky = require('../Controllers/DienBienControllers')


router.route('/du-dieu-kien')
.get(thuky.DuDieuKien)
router.route('/bat-dau-dai-hoi')
// .get(thuky.)
module.exports = router