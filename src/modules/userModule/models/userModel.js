const knex = require('@/db')

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
  create_date: user.create_date,
  update_date: user.update_date,
  groups: user.groups || [],
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
    const user = await baseUserQuery().where({ email }).first()
    return user
  },
}
