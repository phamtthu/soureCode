class APIFeatures {

    /**
     * @param {DocumentQuery} mongooseQuery
     * @param {Object} queryObj
     * */
    constructor(mongooseQuery, queryObj) {
        this.mongooseQuery = mongooseQuery
        this.queryObj = queryObj
    }

    filter() {
        // 1A Filtering
        /* http://127.0.0.1:3000/api/v1/tours?difficulty=easy&duration[lte]=5
        * */
        console.log(this.queryObj)
        const queryObjectClone = {...this.queryObj} // copy object
        const excludedFileds = ['page', 'sort', 'limit', 'fields']
        excludedFileds.forEach(element => delete queryObjectClone[element])
        // 1B Advanced filtering
        let queryStr = JSON.stringify(queryObjectClone) // return query
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => {
            // { difficulty: 'easy', duration: { gte: 5 } }
            // { difficulty: 'easy', duration: { $gte: 5 } }
            return `$${match}`
        })
        console.log(JSON.parse(queryStr))
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryStr)) // return Query.prototype
        return this // return entire object (instance of object)
    }

    sort() {
        // 2 Sorting
        /*URL : http://127.0.0.1:3000/api/v1/tours?sort=-price - for desc
        *       http://127.0.0.1:3000/api/v1/tours?sort=-price,ratingsAverage sort by price and ratingsAverage (if price're same)
        * */
        if (this.queryObj.sort) {
            const sortBy = this.queryObj.sort.split(',').join(' ')
            this.mongooseQuery = this.mongooseQuery.sort(sortBy) // query('field') or query('field1 field2')
        } else {
            this.mongooseQuery = this.mongooseQuery.sort('-createAt')
        }
        return this
    }

    limitFields() {
        /* http://127.0.0.1:3000/api/v1/tours?fields=name,duration,difficulty,price
           * http://127.0.0.1:3000/api/v1/tours?fields=-name
           * */
        if (this.queryObj.fields) {
            const wannaFields = this.queryObj.fields.split(',').join(' ')
            this.mongooseQuery = this.mongooseQuery.select(wannaFields) // only show these fields
        } else {
            this.mongooseQuery = this.mongooseQuery.select('-__v') // - fields: exclude (loại trừ) fields
        }
        return this
    }

    paginate() {
        /* http://127.0.0.1:3000/api/v1/tours?page=2&limit=3 (9 total, 3-6)
       * page=2&limit=10 */
        const page = Number.parseInt(this.queryObj.page) || 1
        const limit = Number.parseInt(this.queryObj.limit) || 100
        const skip = page * limit - limit
        this.mongooseQuery = this.mongooseQuery.skip(skip).limit(limit)
        return this
    }
}

module.exports = APIFeatures