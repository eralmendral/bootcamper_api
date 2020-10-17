const advanceResults = (model, populate) => async (req, res, next) => {
    let query;

    // Copy Request Query
    const reqQuery = { ...req.query };

    // Fields to Exclude
    const removeFields = ['select', 'sort', 'limit', 'page']

    // Loop over remove fields and delete them from request Query
    removeFields.forEach(param => delete reqQuery[param]);

    // Create Query String
    let queryStr = JSON.stringify(reqQuery);

    // Create Operators
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

    // Finding resource
    query = model.find(JSON.parse(queryStr))

    // Select fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    } else {
        query = query.sort('-createdAt');   // descending created at
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await model.countDocuments();

    query = query.skip(startIndex).limit(limit);

    // Populate
    if(populate) {
        query = query.populate(populate);
    }

    // Execute query
    const results = await query;

    // Pagination Result
    const pagination = {};

    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }

    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }

    res.advanceResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    }

    next();
}

module.exports = advanceResults;