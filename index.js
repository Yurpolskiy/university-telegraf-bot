const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();
const help = require('./const.js');

const bot = new Telegraf(process.env.BOT_TOKEN);


let awaitingCity = false; // Перемения для хранения состояния чата

bot.start((ctx) => {
    const chatId = ctx.chat.id;
    const messageId = ctx.message.message_id;
    ctx.reply(`Hello, ${ctx.message.from.first_name ? ctx.message.from.first_name : 'innocent'}! 
                ${help.greetings}`);
});

bot.help((ctx) => ctx.reply(help.commands));

async function fetchApi(city, key) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;
    const response = await fetch(url);
    return await response.json();
}

bot.command('weather', (ctx) => {

    awaitingCity = true;

    ctx.reply('Please enter the city for weather information.');
});


bot.on('text', async (ctx) => {
    try {
        if (awaitingCity) {

            const city = ctx.message.text;

            awaitingCity = false;

            const data = await fetchApi(city, process.env.API_TOKEN);
            console.log(data);

            if (data.weather && data.main && data.wind) {
                const { weather, main, wind } = data;
                const { temp, feels_like, temp_min, temp_max, humidity } = main;
                const { speed } = wind;
                const forecast = weather[0].main;
                const description = weather[0].description;

                await ctx.replyWithHTML(help.temperatureForecast(temp, feels_like, temp_min, temp_max, humidity));
                await ctx.replyWithHTML(help.weatherForecast(forecast, description))
                await ctx.replyWithHTML(help.windForecast(speed))
             ctx.reply(`That's all; Just write the command /weather to get the weather forecast. I wish you luck :DD`);
            } else {
                ctx.reply('City not found, please write another one.');
            }
        }
    } catch (error) {
        console.log(error);
    }
});


bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
