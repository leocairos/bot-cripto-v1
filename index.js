
require('dotenv-safe').config();

const COIN_PAIRS = process.env.COIN_PAIRS.split(';');
let lastmessages = [];

function calcRSI(closes) {
    let altas = 0;
    let baixas = 0;

    for (let i = closes.length - 15; i < closes.length - 1; i++) {
        const diferenca = closes[i] - closes[i - 1];
        if (diferenca >= 0)
            altas += diferenca;
        else
            baixas -= diferenca;
    }

    const forcaRelativa = altas / baixas;
    return 100 - (100 / (1 + forcaRelativa));
}

const { Telegraf } = require("telegraf");
const CHAT_ID = process.env.CHAT_ID;
const bot = new Telegraf(`${process.env.BOT_TOKEN}`);

async function app() {

    const axios = require("axios");

    COIN_PAIRS.forEach(async coinPair => {
        const response = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${coinPair}&interval=1m`);
        const candle = response.data[499];
        const price = parseFloat(candle[4]);
    
        const closes = response.data.map(candle => parseFloat(candle[4]));
        const rsi = calcRSI(closes);
        const infoLog = `CoinPair: ${coinPair} RSI: ${rsi.toFixed(2)} Price: ${price.toFixed(2)}`;
        console.log(infoLog);
    
        if (rsi >= 70 && !lastmessages.includes(`${coinPair}-overbought`)) {
            lastmessages.push(`${coinPair}-overbought`);
            const index = lastmessages.indexOf(`${coinPair}-oversold`);
            if (index > -1) {
                lastmessages.splice(index, 1); 
            }
            
            console.log(`${coinPair}-overbought`);
            bot.telegram.sendMessage(CHAT_ID, `[overbought] ${infoLog}`);
        }
        else if (rsi <= 30 && !lastmessages.includes(`${coinPair}-oversold`) ) {
            lastmessages.push(`${coinPair}-oversold`);
            const index = lastmessages.indexOf(`${coinPair}-overbought`);
            if (index > -1) {
                lastmessages.splice(index, 1); 
            }

            console.log(`${coinPair}-oversold`);
            bot.telegram.sendMessage(CHAT_ID,  `[oversold] ${infoLog}`);
        }
    })
}

const msgLog = 
    `App is running with Get in Binance API every ${process.env.GET_API_INTERVAL/1000} seconds.
    Monitoring Coin Pairs: ${COIN_PAIRS}\n`;

setInterval(app, process.env.GET_API_INTERVAL || 5000);
setInterval(
    () => {bot.telegram.sendMessage(CHAT_ID,  msgLog)}, 
    1000 * 60 * 8);

console.log(msgLog);
bot.telegram.sendMessage(CHAT_ID,  msgLog)

//app();
