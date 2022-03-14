const express = require('express');
const router = express.Router();
const axios = require('axios');

const API_KEY = "c80uf4iad3ie5egtf1eg";
const BASE_URL = "https://finnhub.io/api/v1";

router.get('/api/v1/companyprofile', (req, res, next) => {
    const ticker = req.query.symbol.toUpperCase();
    let response_body;

    axios.get(`${BASE_URL}/stock/profile2?symbol=${ticker}&token=${API_KEY}`)
        .then(resp => {
            response_body = resp.data;
            res.status(200).json(response_body);
        })
        .catch(error => {
            console.error(error)
        })
});

router.get('/api/v1/stock-candle', (req, res, next) => {
    const ticker = req.query.symbol.toUpperCase();
    // let to_time = new Date().getTime();
    // to_time = Math.round(to_time / 1000);
    // let from_time = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
    // from_time.setDate(from_time.getDate() - 1);
    // from_time = from_time.getTime();
    // from_time = Math.round(from_time / 1000);
    let response_body;
    
    const to = req.query.to;
    const from = req.query.from;
    const resolution = req.query.resolution;

    axios.get(`${BASE_URL}/stock/candle?symbol=${ticker}&resolution=${resolution}&from=${from}&to=${to}&token=${API_KEY}`)
        .then(resp => {
            response_body = resp.data;
            res.status(200).json(response_body);
        })
        .catch(error => {
            console.error(error)
        })
});

router.get('/api/v1/quote', (req, res, next) => {
    const ticker = req.query.symbol.toUpperCase();
    let response_body;
    axios.get(`${BASE_URL}/quote?symbol=${ticker}&token=${API_KEY}`)
        .then(resp => {
            response_body = resp.data;
            res.status(200).json(response_body);
        })
        .catch(error => {
            console.error(error)
        })
});

router.get('/api/v1/autocomplete', (req, res, next) => {
    const search_query = req.query.q.toUpperCase();
    let response_body;
    axios.get(`${BASE_URL}/search?q=${search_query}&token=${API_KEY}`)
        .then(resp => {
            response_body = resp.data;
            res.status(200).json(response_body);
        })
        .catch(error => {
            console.error(error)
        })
});

router.get('/api/v1/company-news', (req, res, next) => {
    const ticker = req.query.symbol.toUpperCase();
    let to_time = new Date().toISOString().split("T")[0];
    let from_time = new Date();
    from_time.setDate(from_time.getDate() - 7);
    from_time = from_time.toISOString().split("T")[0];
    
    let response_body;
    axios.get(`${BASE_URL}/company-news?symbol=${ticker}&from=${from_time}&to=${to_time}&token=${API_KEY}`)
        .then(resp => {
            response_body = filterTop20(resp.data);
            res.status(200).json(response_body);
        })
        .catch(error => {
            console.error(error)
        })
});

function filterTop20(articles) {

    const months = {
        0: 'January',
        1: 'February',
        2: 'March',
        3: 'April',
        4: 'May',
        5: 'June',
        6: 'July',
        7: 'August',
        8: 'September',
        9: 'October',
        10: 'November',
        11: 'December'
      }

    let count = 0;
    filtered_articles = [];
    for(i=0; i<articles.length; i++) {
        if (articles[i]['image']!=null && articles[i]['headline']!=null && 
        articles[i]['datetime']!=null && articles[i]['url']!=null) {
            d = new Date(articles[i]['datetime']*1000)
            formatted_date = `${months[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`
            articles[i]['datetime'] = formatted_date;
            count += 1;
            filtered_articles.push(articles[i]);
        }
        if (count == 20){
            break;
        }
    }

    return filtered_articles
}

router.get('/api/v1/recommendation', (req, res, next) => {
    const ticker = req.query.symbol.toUpperCase();
    let response_body;
    axios.get(`${BASE_URL}/stock/recommendation?symbol=${ticker}&token=${API_KEY}`)
        .then(resp => {
            response_body = resp.data;
            res.status(200).json(response_body);
        })
        .catch(error => {
            console.error(error)
        })
});

router.get('/api/v1/sentiment', (req, res, next) => {
    const ticker = req.query.symbol.toUpperCase();
    let response_body;
    axios.get(`${BASE_URL}/stock/social-sentiment?symbol=${ticker}&from=2022-01-01&token=${API_KEY}`)
        .then(resp => {
            response_body = resp.data;
            res.status(200).json(response_body);
        })
        .catch(error => {
            console.error(error)
        })
});

router.get('/api/v1/peers', (req, res, next) => {
    const ticker = req.query.symbol.toUpperCase();
    let response_body;
    axios.get(`${BASE_URL}/stock/peers?symbol=${ticker}&token=${API_KEY}`)
        .then(resp => {
            // response_body = {"peers": resp.data};
            response_body = resp.data;
            res.status(200).json(response_body);
        })
        .catch(error => {
            console.error(error)
        })
});

router.get('/api/v1/earnings', (req, res, next) => {
    const ticker = req.query.symbol.toUpperCase();
    let response_body;
    axios.get(`${BASE_URL}/stock/earnings?symbol=${ticker}&token=${API_KEY}`)
        .then(resp => {
            response_body = resp.data;

            //Test null
            // response_body[0]['actual']= null;
            // response_body[0]['estimate']= null;
            // response_body[0]['surprise']= null;
            // response_body[0]['surprisePercent']= null;

            response_body = JSON.stringify(response_body, function (key, value) {
                return (value === null) ? 0 : value;
            });
            response_body = JSON.parse(response_body);
            res.status(200).json(response_body);
        })
        .catch(error => {
            console.error(error)
        })
});

module.exports = router;