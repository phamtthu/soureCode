const mongoose = require('mongoose')
const slugify = require('slugify')
const validator = require('validator') // use 3rd party validator library
const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
            maxlength: [40, 'A tour name must have less or equal than 40 characters '],
            minlength: [10, 'A tour name must have more or equal than 10 characters'],
            validate:[validator.isAlpha,'A tour name must only contains characters'] // function refernce
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration']
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size']
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficulty'],// array of allow values
                message: 'Difficulty is easy, medium or difficulty'
            }
        },
        ratingsAverage: {
            type: Number,
            default: 4.5,
            min: [1, 'Rating must above 1'],
            max: [5, 'Rating must below 5']
        },
        ratingQuantity: {
            type: Number,
            default: 0
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a price']
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (value) { // value is the value user given
                    // we didn't call this function here, just simply put this callback function here and it will be call as soon as data should be validated
                    // here is function referece (function without () )
                    return value < this.price
                },
                message: 'Discount price ({VALUE}) must be below current price',
            },

        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must a description']
        },
        description: {
            type: String,
            trim: true
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have a image']
        },
        images: [String], // Image as Array of String
        createAt: {
            type: Date,
            default: Date.now(),
            select: false // not include this field in find() or findOne()
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false
        }
    },
    {
        toJSON: {virtuals: true}, // show virtual property when show output as Json
        toObject: {virtuals: true} // show virtual property when show show output as Object
    }
)

// DOCUMENT MIDDLEWARE: run before .save() and create()
tourSchema.pre('save', function (next) {
    this.slug = slugify(this.name, {lower: true})
    next()
})

// tourSchema.pre('save',function(next){
//     console.log('Will save document...')
//     next()
// })
//
// // run after .save() or .create()
// tourSchema.post('save', function (doc, next) {
//     // doc is the document just saved in DB
//     console.log(typeof doc)
//     next()
// })


// Virtual property
tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7
})

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function (next) {
    // use JS regex to trigger this middle with function start by find.... (findById,...) or just create new function with 'findOne'
    this.find({secretTour: {$ne: true}}) // this: DocumentQuery before await so it is Object but not Array
    this.start = Date.now()
    next()
})

tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query took: ${Date.now() - this.start} milliseconds`)
    next()
})


// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({$match: {secretTour: {$ne: true}}}) // this is aggregation object
    // console.log(pipeline) to understand more
    next()
})

const Tour = mongoose.model('Tour', tourSchema)

module.exports = Tour