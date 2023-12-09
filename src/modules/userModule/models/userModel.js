const knex = require('@src/db')
const { GENDER } = require('../constants/user')
const moment = require('@src/utils/moment')

const baseUserQuery = () =>
  knex('user')
    .leftJoin('user_group', 'user.id', '=', 'user_group.user_id')
    .leftJoin('auth_group', 'user_group.group_id', '=', 'auth_group.id')

const getGroupsArrayColumn = () =>
  knex.raw(
    'COALESCE(ARRAY_AGG(auth_group.name) FILTER (WHERE auth_group.name IS NOT NULL), ARRAY[]::TEXT[]) as groups',
  )

const serializeUser = (user) => ({
  id: user.id,
  email: user.email,
  prefix: user.prefix,
  firstname: user.firstname,
  lastname: user.lastname,
  fullname: `${user.firstname} ${user.lastname}`,
  school: user.school,
  gender: user.gender ? GENDER.find((v) => v.id === user.gender).name : '',
  birthday: user.birthday ? moment(user.birthday).format('YYYY-MM-DD') : null,
  phone: user.phone,
  province: user.province,
  create_date: user.create_date ? moment(user.create_date).format('YYYY-MM-DD HH:mm') : null,
  update_date: user.update_date ? moment(user.update_date).format('YYYY-MM-DD HH:mm') : null,
  groups: user.groups || [],
  del_flag: user.del_flag,
})

module.exports = {
  registerUser: async (register) => {
    const createdUser = await baseUserQuery().insert(register).returning('*')
    return createdUser ? serializeUser(createdUser[0]) : null
  },
  getAllUser: async (filters = {}) => {
    const users = await baseUserQuery()
      .select('user.*')
      .select(getGroupsArrayColumn())
      .where(filters)
      .groupBy('user.id')
    return users.map(serializeUser)
  },
  getUser: async (id, filters = {}) => {
    const user = await baseUserQuery()
      .select('user.*')
      .select(getGroupsArrayColumn())
      .where({ ...filters, 'user.id': id })
      .groupBy('user.id')
    return user.length ? serializeUser(user[0]) : null
  },
  getUserWithPassword: async (email) => {
    const user = await knex('user').where({ email }).first().select('id', 'email', 'password')
    return user
  },
  updateUser: async (id, data) => {
    const updatedUser = await knex('user').where({ id }).update(data).returning('*')
    return updatedUser ? serializeUser(updatedUser[0]) : null
  },
}
