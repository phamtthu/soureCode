/*const fs = require('fs');
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')

exports.checkIfIDIsExist = (req, res, next, val) => {
    // val is the value of "id" param in middleware function [ route.param('id') ]
    if (!tours.find(tour => tour.id === parseInt(val /!* req.params.id *!/)))
        return res.status(404).json({
            status: 'fail',
            message: 'Invalied ID'
        })
    else
        next()
}
exports.checkBody = (req, res, next) => {
    if (!(Boolean(req.body.name) && Boolean(req.body.price))) {
        return res.status(400).json({
            status: 'fail',
            message: 'Got a problem with name or price'
        })
    } else next()

}
*/
const Tour = require('./../models/tourModel.js');
const APIFeatures = require('./../utils/apiFeatures.js')

exports.aliasTopTour = (req, res, next) => {
    req.query.limit = '5'
    req.query.sort = '-ratingsAverage,price'
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty'
    next()
}

// 2. ROUTE HANDLERS----------------
exports.getAllTours = async (req, res) => {
    try {
        // 1 Build query

        // // 1A Filtering
        // /* http://127.0.0.1:3000/api/v1/tours?difficulty=easy&duration[lte]=5
        // * */
        // console.log(req.query)
        // const queryObject = {...req.query} // copy object
        // const excludedFileds = ['page', 'sort', 'limit', 'fields']
        // excludedFileds.forEach(element => delete queryObject[element])
        // // 1B Advanced filtering
        // let queryStr = JSON.stringify(queryObject) // return query
        // queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => {
        //     // { difficulty: 'easy', duration: { gte: 5 } }
        //     // { difficulty: 'easy', duration: { $gte: 5 } }
        //     return `$${match}`
        // })
        // console.log(JSON.parse(queryStr))
        // let query = Tour.find(JSON.parse(queryStr)) // return Query.prototype

        // // 2 Sorting
        // /*URL : http://127.0.0.1:3000/api/v1/tours?sort=-price - for desc
        // *       http://127.0.0.1:3000/api/v1/tours?sort=-price,ratingsAverage sort by price and ratingsAverage (if price're same)
        // * */
        // if (req.query.sort) {
        //     const sortBy = req.query.sort.split(',').join(' ')
        //     query = query.sort(sortBy) // query('field') or query('field1 field2')
        // } else {
        //     query = query.sort('-createAt')
        // }

        // 3 Filed limiting
        // /* http://127.0.0.1:3000/api/v1/tours?fields=name,duration,difficulty,price
        // * http://127.0.0.1:3000/api/v1/tours?fields=-name
        // * */
        // if (req.query.fields) {
        //     const wannaFields = req.query.fields.split(',').join(' ')
        //     query = query.select(wannaFields) // only show these fields
        // } else {
        //     query = query.select('-__v') // - fields: exclude (loại trừ) fields
        // }

        // 4 Pagination
        // /* http://127.0.0.1:3000/api/v1/tours?page=2&limit=3 (9 total, 3-6)
        // * page=2&limit=10 */
        // const page = Number.parseInt(req.query.page) || 1
        // const limit = Number.parseInt(req.query.limit) || 100
        // const skip = page * limit - limit
        // query = query.skip(skip).limit(limit)
        // if (req.query.page) {
        //     const numTours = await Tour.countDocuments()
        //     if (skip >= numTours)
        //         throw new Error('This page does not exist')
        // }

        // Execute query
        const features = new APIFeatures(Tour.find(), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate()

        const tours = await features.mongooseQuery // array of object
        // Send response
        res.status(200).json({
            // 2 Sorting
            status: 'success',
            results: tours.length,
            data: {
                tours: tours
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.createTour = async (req, res) => {
    try {
        const newTour = await Tour.create(req.body)
        res.status(201).json({
            status: 'success',
            data: {
                tour: newTour
            }
        })
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        })
    }
}

exports.getTour = async (req, res) => {
    try {
        const tour = await Tour.findById(req.params.id)
        res.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.updateTour = async (req, res) => {
    try {
        const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // return the update document rather than the original
            runValidators: true,
            context: 'query' // to get access to 'query object' by 'this' when use 'custom validate' with .update() in DB
        })
        res.status(200).json({
            status: 'success',
            data: {
                tour: tour
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }


}

exports.removeTour = async (req, res) => {
    try {
        await Tour.findByIdAndRemove(req.params.id)
        res.status(204).json({
            status: 'success',
            data: null
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

module.exports.getTourStats = async (req, res) => {
    try {
        const stats = await Tour.aggregate([
            //https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/
            {
                $match: {ratingsAverage: {$gte: 4.5}}
            },
            {
                $group: {
                    _id: '$difficulty',
                    numTours: {$sum: 1},
                    avgRating: {$avg: '$ratingsAverage'},
                    avgPrice: {$avg: '$price'},
                    minPrice: {$min: '$price'},
                    maxPrice: {$max: '$price'}
                }
            },
            {
                $sort: {avgPrice: 1} // acsending
            }
        ])
        res.status(201).json({
            status: 'success',
            data: {
                tour: stats
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.getMontlyPlan = async (req, res) => {
    const year = Number.parseInt(req.params.year)
    const plan = await Tour.aggregate([
        {
            $unwind: '$startDates'
        },
        {
            $match: {
                startDates: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`)
                }
            }
        },
        {
            $group: {
                _id: {$month: '$startDates'},
                numTourStarts: {$sum: 1},
                tours: {$push: '$name'}
            }
        },
        {
            $addFields: {month: '$_id'}
        },
        {
            $project: {
                _id: 0
            }
        },
        {
            $sort: {numTourStarts: -1}
        }
    ])
    res.status(201).json({
        status: 'success',
        data: {
            tour: plan
        }
    })
}
