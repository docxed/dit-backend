const userModel = require('../models/userModel')
const userGroupModel = require('../models/userGroupModel')
const { createError } = require('../../../utils/errorHandler')
const {
  validateRegister,
  validateLogin,
  validateChangePassword,
  validateResetPassword,
} = require('../validations/authValidation')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const moment = require('../../../utils/moment')
const { sendMail } = require('../../../utils/mailler')

module.exports = {
  generateToken: async (user) => {
    const payload = user
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
      email: registerData.email,
      prefix: registerData.prefix,
      firstname: registerData.firstname,
      lastname: registerData.lastname,
      school: registerData.school,
      password: password_hashed,
      gender: registerData.gender,
      birthday: registerData.birthday,
      phone: registerData.phone,
      province: registerData.province,
      create_date: moment().format(),
      del_flag: false,
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
    const user = await userModel.getUserWithPassword({ email: loginData.email, del_flag: false })
    if (!user) throw createError(400, 'อีเมลหรือรหัสผ่านไม่ถูกต้อง', 'ValidationError')
    const passwordMatch = await bcrypt.compare(loginData.password, user.password)
    if (!passwordMatch) throw createError(400, 'อีเมลหรือรหัสผ่านไม่ถูกต้อง', 'ValidationError')
    const userData = await userModel.getUser(user.id)
    return await module.exports.generateToken(userData)
  },
  getMe: async (id) => {
    return await userModel.getUser(id)
  },
  changePassword: async (id, changePassword) => {
    const { error, value: passwordData } = validateChangePassword(changePassword)
    if (error) throw error
    const user = await userModel.getUserWithPassword({ id, del_flag: false })
    if (!user) throw createError(400, 'ไม่พบผู้ใช้งาน', 'ValidationError')
    const passwordMatch = await bcrypt.compare(passwordData.password, user.password)
    if (!passwordMatch) throw createError(400, 'รหัสผ่านเดิมไม่ถูกต้อง', 'ValidationError')
    const password_hashed = await module.exports.passwordHash(passwordData.new_password)
    return await userModel.updateUser(id, { password: password_hashed })
  },
  resetPassword: async ({ email }) => {
    const { error, value: emailData } = validateResetPassword({ email })
    if (error) throw error
    const user = (await userModel.getAllUser({ email: emailData.email }))[0]
    if (!user) throw createError(400, 'ไม่พบผู้ใช้งาน', 'ValidationError')
    const newPassword = Math.random().toString(36).slice(-8)
    const password_hashed = await module.exports.passwordHash(newPassword)
    await userModel.updateUser(user.id, { password: password_hashed })
    await sendMail({
      from: process.env.MAILER_USER,
      to: emailData.email,
      subject: 'รีเซ็ตรหัสผ่าน',
      text: `รหัสผ่านชั่วคราวของคุณคือ ${newPassword}`,
    })
  },
}
