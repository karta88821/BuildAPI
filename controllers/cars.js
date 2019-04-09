const User = require('../models/user')
const Car = require('../models/car')

module.exports = {
    index: async (req, res, next) => {
        const cars = await Car.find({})
        res.status(200).json(cars)
    },

    newCar: async (req, res, next) => {
        // 1. Find the actual seller -> not just a ud anymore
        const seller = await User.findById(req.value.body.seller)

        // 2. Create a new car 
        const newCar = req.value.body
        delete newCar.seller // "clean" the body data

        const car = new Car(newCar)
        car.seller = seller
        await car.save()

        // 3. Add newly created car to the actual seller
        seller.car.push(car)
        await seller.save() 

        res.status(201).json(car)
    },

    getCar: async (req, res, next) => {
        const car = await Car.findById(req.value.params.carId)
        res.status(200).json(car)
    },

    replaceCar: async (req, res, next) => {
        const { carId } = req.value.params
        const newCar = req.value.body
        const result = await Car.findByIdAndUpdate(carId, newCar)
        res.status(200).json({ success: true })
    },

    updateCar: async (req, res, next) => {
        const { carId } = req.value.params
        const newCar = req.value.body
        const result = await Car.findByIdAndUpdate(carId, newCar)
        res.status(200).json({ success: true })
    },

    deleteCar: async (req, res, next) => {
        // Get a  car
        const { carId } = req.value.params
        const car = await Car.findById(carId)

        // Check is aleardy deleted or not
        if (!car) {
            return res.status(404).json({ error: 'Car doesn\'t exist' })
        }

        // Get a seller
        const sellerId = car.seller
        const seller = await User.findById(sellerId)

        // Remove the car
        await car.remove()
        // Remove car from the seller selling's list
        seller.car.pull(car)
        await seller.save()

        res.status(200).json({ success: true })
    }
}