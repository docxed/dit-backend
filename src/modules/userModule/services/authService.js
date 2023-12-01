const userModel = require('../models/userModel')
const userGroupModel = require('../models/userGroupModel')
const { createError } = require('@/utils/errorHandler')
const { validateRegister, validateLogin } = require('../validations/authValidation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

module.exports = {
  generateToken: async (user) => {
    const payload = {
      id: user.id,
      email: user.email,
      groups: user.groups,
    }
    return {
      access_token: jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 24 * 60 * 60, // 24 hours
      }),
      refresh_token: jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 7 * 24 * 60 * 60, // 7 days
      }),
    }
  },
  validateRefreshToken: async (refresh_token) => {
    try {
      const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET)
      const user = await userModel.getUser(decoded.id)
      if (!user) throw createError(401, 'refresh_token ไม่ถูกต้อง', 'UnauthorizedError')
      return await module.exports.generateToken(user)
    } catch (err) {
      throw createError(401, 'refresh_token ไม่ถูกต้อง', 'UnauthorizedError')
    }
  },
  passwordHash: async (password) => {
    return await bcrypt.hash(password, 10)
  },
  registerUser: async (register) => {
    const { error, value: registerData } = validateRegister(register)
    if (error) throw error
    const userExist = await userModel.getAllUser({ email: registerData.email })
    if (userExist.length > 0) throw createError(400, 'อีเมลนี้มีผู้ใช้งานแล้ว', 'ValidationError')

    const password_hashed = await module.exports.passwordHash(registerData.password)
    const createdUser = await userModel.registerUser({
      ...registerData,
      password: password_hashed,
    })
    await userGroupModel.createUserGroup({
      user_id: createdUser.id,
      group_id: 3,
    })
    return await userModel.getUser(createdUser.id)
  },
  loginUser: async (login) => {
    const { error, value: loginData } = validateLogin(login)
    if (error) throw error
    const user = await userModel.getUserWithPassword(loginData.email)
    if (!user) throw createError(400, 'อีเมลหรือรหัสผ่านไม่ถูกต้อง', 'ValidationError')
    const passwordMatch = await bcrypt.compare(loginData.password, user.password)
    if (!passwordMatch) throw createError(400, 'อีเมลหรือรหัสผ่านไม่ถูกต้อง', 'ValidationError')
    return await module.exports.generateToken(user)
  },
  getMe: async (id) => {
    return await userModel.getUser(id)
  },
}
