const moment = require('../../../utils/moment')
const { validateCreateExamset } = require('../validations/examsetValidation')
const examsetModel = require('../models/examsetModel')
const { createError } = require('../../../utils/errorHandler')

module.exports = {
  createExamset: async (examset, user) => {
    const { error, value: examsetData } = validateCreateExamset(examset)
    if (error) throw error
    return await examsetModel.createExamset({
      title: examsetData.title,
      description: examsetData.description,
      time: examsetData.time,
      max_attempt: examsetData.max_attempt,
      is_password: examsetData.is_password,
      password: examsetData.password || '',
      create_by_id: user.id,
      create_date: new Date(),
      del_flag: false,
      is_published: examsetData.is_published,
    })
  },
  getExamset: async (id) => {
    const examset = await examsetModel.getExamset(id, {
      'examset.del_flag': false,
    })
    if (examset) {
      return examset
    } else {
      throw createError(404, 'ไม่พบข้อมูลที่คุณต้องการ', 'NotFoundError')
    }
  },
  getAllExamset: async (filters = {}) => {
    return await examsetModel.getAllExamset(filters)
  },
  deleteExamset: async (id) => {
    return await examsetModel.deleteExamset(id)
  },
  updateExamset: async (id, examset, user) => {
    const { error, value: examsetData } = validateCreateExamset(examset)
    if (error) throw error
    return await examsetModel.updateExamset(id, {
      title: examsetData.title,
      description: examsetData.description,
      time: examsetData.time,
      max_attempt: examsetData.max_attempt,
      is_password: examsetData.is_password,
      password: examsetData.password || '',
      update_by_id: user.id,
      update_date: new Date(),
      is_published: examsetData.is_published,
    })
  },
  patchExamset: async (id, examset, user) => {
    return await examsetModel.updateExamset(id, {
      ...examset,
      update_by_id: user.id,
      update_date: new Date(),
    })
  },
}
