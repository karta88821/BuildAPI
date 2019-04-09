const router = require('express-promise-router')()

const CarsController = require('../controllers/cars')

const { validateParam, validateBody, schemas } = require('../helpers/routeHelpers')

router.route('/')
    .get(CarsController.index)
    .post(validateBody(schemas.newCarSchema), 
          CarsController.newCar)

router.route('/:carId')
    .get(validateParam(schemas.idSchema, 'carId'),
         CarsController.getCar)
    .put([validateParam(schemas.idSchema, 'carId'),
          validateBody(schemas.carSchema)],
          CarsController.replaceCar)
    .patch([validateParam(schemas.idSchema, 'carId'),
            validateBody(schemas.carOptionalSchema)], 
            CarsController.updateCar)
    .delete(validateParam(schemas.idSchema, 'carId'),
            CarsController.deleteCar)

module.exports = router;