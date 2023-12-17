const express = require('express')
const router = express.Router()
const examsetController = require('../controllers/examsetController')

router.post('/', examsetController.createExamset)
router.get('/:id', examsetController.getExamset)
router.get('/', examsetController.getAllExamset)
router.delete('/:id', examsetController.deleteExamset)
router.put('/:id', examsetController.updateExamset)
router.patch('/:id', examsetController.patchExamset)

module.exports = router
