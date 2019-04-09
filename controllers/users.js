const User = require('../models/user')

module.exports = {
    index: async (req, res, next) => {
        // await -> this task takes some times, wait for it until finished.
        const users = await User.find({})
        res.status(200).json(users)
    },

    newUser: async (req, res, next) => {
        const newUser = new User(req.value.body)
        const user = await newUser.save()
        res.status(201).json(user)
    },

    getUser: async (req, res, next) => {
        // New way
        const { userId } = req.value.params
        // Old way
        // const { userId } = req.params // == const userId = req.params.userId
        const user = await User.findById(userId)
        res.status(200).json(user)
    },

    replaceUser: async (req, res, next) => {
        // enforce that req.body must contain all the fields
        const { userId } = req.value.params
        const newUser = req.value.body;
        const result = await User.findByIdAndUpdate(userId, newUser)
        console.log('result', result)
        res.status(200).json({ success: true })
    },

    updateUser: async (req, res, next) => {
        // req.body may contain any number of fields
        const { userId } = req.value.params
        const newUser = req.value.body;
        const result = await User.findByIdAndUpdate(userId, newUser)
        console.log('result', result)
        res.status(200).json({ success: true })
    },
    
    getUserCars: async (req, res, next) => {
        const { userId } = req.value.params
        const user = await User.findById(userId).populate('car')
        res.status(200).json(user.car)
    },

    newUserCar: async (req, res, next) => {
        const { userId } = req.value.params
        // Create a new car
        const newCar = new Car(req.value.body)
        console.log('newCar', newCar)
        // Get user
        const user = await User.findById(userId)
        // Assign user as a car's seller
        newCar.seller = user
        // Save the car
        await newCar.save()
        // Add car to the user's selling array 'cars'
        user.car.push(newCar._id)
        // Save the user
        await user.save()
        res.status(201).json(newCar)
    }
}