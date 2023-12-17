const knex = require('../../../db')
const moment = require('../../../utils/moment')

const baseQuery = () =>
  knex('examset')
    .leftJoin('user as cu', 'examset.create_by_id', '=', 'cu.id')
    .leftJoin('user as uu', 'examset.update_by_id', '=', 'uu.id')
    .select([
      'examset.*',
      knex.raw("CONCAT(cu.firstname, ' ', cu.lastname) as create_by_name"),
      knex.raw("CONCAT(uu.firstname, ' ', uu.lastname) as update_by_name"),
    ])

const serializeExamset = (examset) => ({
  id: examset.id,
  title: examset.title,
  description: examset.description,
  time: Number(examset.time),
  max_attempt: Number(examset.max_attempt),
  is_password: examset.is_password,
  password: examset.password,
  create_date: examset.create_date
    ? moment(examset.create_date).format('YYYY-MM-DD HH:mm:ss')
    : null,
  update_date: examset.update_date
    ? moment(examset.update_date).format('YYYY-MM-DD HH:mm:ss')
    : null,
  create_by_name: examset.create_by_name,
  update_by_name: examset.update_by_name,
  del_flag: examset.del_flag,
  is_published: examset.is_published,
})

module.exports = {
  createExamset: async (data) => {
    const examsetCreated = await knex('examset').insert(data).returning('id')
    return examsetCreated ? await module.exports.getExamset(examsetCreated[0].id) : null
  },
  getExamset: async (id, filters = {}) => {
    const [examset] = await baseQuery().where({ ...filters, 'examset.id': id })
    console.log(examset)
    return examset ? serializeExamset(examset) : null
  },
  getAllExamset: async (filters = {}) => {
    let query = baseQuery()
    Object.keys(filters).forEach((key) => {
      query.where(key, filters[key].operator, filters[key].value)
    })
    const examsets = await query
    return examsets ? examsets.map(serializeExamset) : []
  },
  deleteExamset: async (id) => {
    await knex('examset').where({ id }).update({ del_flag: true })
    return true
  },
  updateExamset: async (id, data) => {
    await knex('examset').where({ id }).update(data)
    return await module.exports.getExamset(id)
  },
}
