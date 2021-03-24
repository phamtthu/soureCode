const express = require('express');

const tourControllers = require('./../controller/tourControllers.js');

const router = express.Router()

/*router.param('id', tourControllers.checkIfIDIsExist)*/

/* http://127.0.0.1:3000/api/v1/tours/limit=5&sort=-ratingAverage,price&fields=name,price,ratingAverage,summary,difficulty
* */
/*router.route('/top-5-cheap').get((
    (req, res, next) => {
        tourControllers.aliasTopTour(req, res, next)
    }), (req, res) => {
    tourControllers.getAllTours(req, res)
})*/

router.route('/top-5-cheap')
    .get(
        tourControllers.aliasTopTour,
        tourControllers.getAllTours
    )

router.route('/tour-stats')
    .get(tourControllers.getTourStats)

router.route('/monthly-plan/:year')
    .get(tourControllers.getMontlyPlan)

router.route('/')
    .get(tourControllers.getAllTours)
    .post(/*tourControllers.checkBody,  add chain multiple middleware */tourControllers.createTour);

router.route('/:id')
    .get(tourControllers.getTour)
    .patch((tourControllers.updateTour))
    .delete(tourControllers.removeTour);

module.exports = router