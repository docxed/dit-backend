const { auth, role } = require('../../../middlewares/authMiddleware')
const examsetService = require('../services/examsetService')
const moment = require('../../../utils/moment')
const knex = require('../../../db')
module.exports = {
  createExamset: [
    auth,
    role(['แอดมิน']),
    async (req, res, next) => {
      try {
        const examset = await examsetService.createExamset(req.body, req.user)
        res.status(201).json(examset)
      } catch (err) {
        next(err)
      }
    },
  ],
  getExamset: [
    auth,
    async (req, res, next) => {
      try {
        const examset = await examsetService.getExamset(req.params.id)
        res.status(200).json(examset)
      } catch (err) {
        next(err)
      }
    },
  ],
  getAllExamset: [
    auth,
    async (req, res, next) => {
      try {
        const { start_date, end_date, del_flag } = req.query
        const filters = {}
        if (del_flag) {
          filters['examset.del_flag'] = {
            operator: '=',
            value: del_flag === 'true',
          }
        }
        if (start_date && end_date) {
          filters['examset.create_date'] = {
            operator: 'between',
            value: [
              moment(start_date).set({ hour: 0, minute: 0, second: 0 }),
              moment(end_date).set({ hour: 23, minute: 59, second: 59 }),
            ],
          }
        } else if (start_date) {
          filters['examset.create_date'] = {
            operator: '>=',
            value: moment(start_date).set({ hour: 0, minute: 0, second: 0 }),
          }
        } else if (end_date) {
          filters['examset.create_date'] = {
            operator: '<=',
            value: moment(end_date).set({ hour: 23, minute: 59, second: 59 }),
          }
        }
        const examsets = await examsetService.getAllExamset(filters)
        res.status(200).json(examsets)
      } catch (err) {
        next(err)
      }
    },
  ],
  deleteExamset: [
    auth,
    role(['แอดมิน']),
    async (req, res, next) => {
      try {
        await examsetService.deleteExamset(req.params.id)
        res.status(204).end()
      } catch (err) {
        next(err)
      }
    },
  ],
  updateExamset: [
    auth,
    role(['แอดมิน']),
    async (req, res, next) => {
      try {
        const examset = await examsetService.updateExamset(req.params.id, req.body, req.user)
        res.status(200).json(examset)
      } catch (err) {
        next(err)
      }
    },
  ],
  patchExamset: [
    auth,
    role(['แอดมิน']),
    async (req, res, next) => {
      try {
        const examset = await examsetService.patchExamset(req.params.id, req.body, req.user)
        res.status(200).json(examset)
      } catch (err) {
        next(err)
      }
    },
  ],
}
