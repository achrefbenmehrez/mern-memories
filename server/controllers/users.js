const User = require('../models/User')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

exports.signIn = async (req, res) => {
    const {
        email,
        password
    } = req.body
    try {
        existingUser = await User.findOne({
            email
        })

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password)

        if (!isPasswordCorrect) return res.status(401).json({
            message: 'Invalid credentials'
        })

        const token = jwt.sign({
            email: existingUser.email,
            id: existingUser._id
        }, process.env.JWT_SECRET, {
            expiresIn: '1h'
        })

        res.json({
            result: existingUser,
            token
        })
    } catch (error) {
        res.status(500)
            .json({
                message: 'Something went wrong, please try again'
            })
    }
}

exports.signUp = async (req, res) => {
    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword
    } = req.body

    try {
        const existingUser = await User.findOne({
            email
        })

        if (existingUser)
            res.status(401).json({
                message: 'User already exists'
            })
        else {
            if (password !== confirmPassword)
                res.status(401).json({
                    message: 'Passwords dont match'
                })
            else {
                const hashedPassword = await bcrypt.hash(password, 12)

                const result = await User.create({
                    email,
                    password: hashedPassword,
                    name: `${firstName} ${lastName}`
                })

                const token = jwt.sign({
                    email: result.email,
                    id: result._id
                }, process.env.JWT_SECRET, {
                    expiresIn: '1h'
                })

                return res.json({
                    token,
                    result
                })
            }
        }
    } catch (error) {
        res.status(500)
            .json({
                message: 'Something went wrong, please try again'
            })
    }
}