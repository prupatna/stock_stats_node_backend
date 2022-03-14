const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');


const productRoutes = require('./api/routes/products');
const finnhubRoutes = require('./api/routes/finnhub');


app.use(morgan('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// To prevent CORS error
// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header('Access-Control-Allow-Headers', '* ');
//     if (req.method === 'OPTIONS') {
//         res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
//         return res.status(200).json({});
//     }
// });


// app.use((req, res, next) => {
//     res.status(200).json({
//         message: "It Works!"
//     });
// })

app.use('/', finnhubRoutes);

// app.use('/products', productRoutes);

// error handling.
// This line should be at the end. So, when none of the 
// routes work, it will come to this middleware handler
app.use((req, res, next) => {
    const error = new Error('URL Not Found');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message || "Internal Server Error"
        }
    })
})

module.exports = app;