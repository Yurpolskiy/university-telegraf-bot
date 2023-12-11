const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();
const help = require('./const.js');

const bot = new Telegraf(process.env.BOT_TOKEN);

let forecastInfo = {};

bot.start((ctx) => {
    const chatId = ctx.chat.id;
    const messageId = ctx.message.message_id;
    ctx.reply(`Hello, ${ctx.message.from.first_name ? ctx.message.from.first_name : 'innocent'}! ${help.greetings}`);
    ctx.replyWithHTML(`Write the <code>/weather</code> to work with me!!`)
});

bot.help((ctx) => ctx.reply(help.commands));

async function fetchApi(city, key) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;
    const response = await fetch(url);
    return await response.json();
}

bot.command('weather', async (ctx) => {
  ctx.reply(`Hello, enter the city name and i'll give u the weather forecast!`)
  bot.on(`message`, async(ctx) => {
    const city = ctx.message.text;

    const data = await fetchApi(city, process.env.API_TOKEN);

    if(data.cod === '404') {
        ctx.reply(`City not found, please write another one.`);
    } else {
        const { weather, main, wind } = data;
        forecastInfo.temperature = main
        forecastInfo.weather = weather[0]
        forecastInfo.wind = wind

        console.log(forecastInfo.temperature)

        console.log(`dataCreator >> temp >> ${JSON.stringify(...Object.values(forecastInfo.temperature))}`)
        console.log(`dataCreator >> weather >> ${JSON.stringify(...Object.values(forecastInfo.weather))}`)
        console.log(`dataCreator >> wind >> ${JSON.stringify(...Object.values(forecastInfo.wind))}`)

        await ctx.replyWithHTML(`<b>Forecast:</b>`, Markup.inlineKeyboard([
            [Markup.button.callback('Get temperature', 'temperature')],
            [Markup.button.callback('Get weather', 'weather')],
            [Markup.button.callback('Get wind', 'wind')],
        ]))

        createAction('temperature', help.temperatureForecast(...Object.values(forecastInfo.temperature)))
        createAction('weather', help.weatherForecast(...Object.values(forecastInfo.weather)))
        createAction('wind', help.windForecast(...Object.values(forecastInfo.wind)))
    }
  })
})

function createAction(trigger, text) {
    bot.action(trigger, async (ctx) => {
        try {
            await ctx.answerCbQuery();
            await ctx.replyWithHTML(text, {
                disable_web_page_preview: true
            });
        } catch (error) {
            console.log(error);
        }
    });
}

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
