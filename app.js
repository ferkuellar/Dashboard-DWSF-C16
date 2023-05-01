const express = require('express')
const app = express()
const port = 3000
var request = require('request')
var multer = require('multer');
var upload = multer();
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // Para parsing JSON
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public')); // __dirname es la ruta de donde esta el directorio public
app.set('view engine', 'ejs');  
app.use(upload.array()); 

let mData = ""
let coinName = "bitcoin"
let mChart = ""


async function resData(coinName) {
    var marketData = await new Promise((resolve, reject) => {
        request('https://api.coingecko.com/api/v3/coins/' + coinName, function (error, response, body) {
            console.error('error:', error); // Print the error if one occurred
            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            console.log('body:', typeof body); // Print the HTML for the Google homepage.
            mData = JSON.parse(body)
            // console.log(mData)
        resolve(mData)
        });
    });    

    if(marketData){
        var marketChart = await new Promise((resolve, reject) => {
            request('https://api.coingecko.com/api/v3/coins/' + coinName + '/market_chart?vs_currency=usd&days=30', function (error, response, body) {
                console.error('error:', error); // Imprime el error si ocurre
                console.log('statusCode:', response && response.statusCode); // IMprime el response si la respuesta es correcta
                console.log('body:', typeof body); // Imprime el HTML para Google homepage.
                mChart = JSON.parse(body)
                // console.log(mData)
                // console.log(mChart)
            resolve(mData)
            });
        });    
    };
};

app.get('/', async(req, res) => {
    await resData(coinName)
    res.render('index', { mData, mChart, coinName } )
});

app.post('/', async(req,res) => {
    coinName = req.body.selectCoin;
    await resData(coinName)
    res.render('index', { mData, mChart, coinName } )
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
});