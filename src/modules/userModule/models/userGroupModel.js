const knex = require('@src/db')

const baseUserGroupQuery = () => knex('user_group')

const serializeUserGroup = (userGroup) => ({
  id: userGroup.id,
  user_id: userGroup.user_id,
  group_id: userGroup.group_id,
})

module.exports = {
  createUserGroup: async (data) => {
    const userGroupCreated = await baseUserGroupQuery().insert(data).returning('*')
    return userGroupCreated ? serializeUserGroup(userGroupCreated[0]) : null
  },
}
