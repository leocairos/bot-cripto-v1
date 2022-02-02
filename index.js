
require('dotenv-safe').config();

const axios = require("axios");

const indicators = require('./indicators')
const telegram = require('./telegram')

const COIN_PAIRS = process.env.COIN_PAIRS.split(';');
let lastmessages = [];

function updateMessages (coinPair, status, infoLog) {
    const itemToRemove = status === 'overbought' ? 'oversold' : 'overbought'; 

    lastmessages.push(`${coinPair}-${status}`);
    const index = lastmessages.indexOf(`${coinPair}-${itemToRemove}`);
    if (index > -1) {
        lastmessages.splice(index, 1); 
    }
    
    console.log(`${coinPair}-${status}`);
    //telegram.sendMessage(`[${status}] ${infoLog}`);
}

async function app() {

    COIN_PAIRS.forEach(async coinPair => {
        const response = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${coinPair}&interval=1m`);
        const candle = response.data[499];
        const price = parseFloat(candle[4]);
    
        const closes = response.data.map(candle => parseFloat(candle[4]));
        //const rsi = indicators.calcRSI(closes);
        const rsi = indicators.rsi(closes);
        //const infoLog = `CoinPair: ${coinPair} RSI: ${rsi.toFixed(2)} Price: ${price.toFixed(2)}`;
        const infoLog = 
            `CoinPair: ${coinPair} RSI(6/14/24): ${rsi[0].toFixed(2)}/${rsi[1].toFixed(2)}/${rsi[2].toFixed(2)} Price: ${price.toFixed(2)}`;
        console.log(infoLog);
    
        //if (rsi >= 70 && !lastmessages.includes(`${coinPair}-overbought`)) {
        if ( (rsi[0] >= 70 || rsi[1] >= 70 || rsi[2] >= 70) && !lastmessages.includes(`${coinPair}-overbought`)) {
            updateMessages(coinPair, 'overbought', infoLog);
        }
        //else if (rsi <= 30 && !lastmessages.includes(`${coinPair}-oversold`) ) {
        else if ( (rsi[0] <= 30 || rsi[1] <= 30 || rsi[2] <= 30) && !lastmessages.includes(`${coinPair}-oversold`) ) {
            updateMessages(coinPair, 'oversold', infoLog);
        }
    })
}

const msgLog = 
    `App is running with Get in Binance API every ${process.env.GET_API_INTERVAL/1000} seconds.
    Monitoring Coin Pairs: ${COIN_PAIRS}\n`;

setInterval(app, process.env.GET_API_INTERVAL || 5000);
//setInterval( () => { telegram.sendMessage(msgLog); }, 1000 * 60 * 60 * 8); // every 8 hours

console.log(msgLog);
//telegram.sendMessage(msgLog);
