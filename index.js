const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();
const help = require('./const.js');

// getting the bot token
const bot = new Telegraf(process.env.BOT_TOKEN);

// context we will use to to determine if the user has entered the /weather command
let weatherContext = false

bot.start((ctx) => {
    const chatId = ctx.chat.id;
    const messageId = ctx.message.message_id;
    // Checking if user has first name if he's not writing innocent
    ctx.reply(`Hello, ${ctx.message.from.first_name ? ctx.message.from.first_name : 'innocent'}! ${help.greetings}`);
    ctx.replyWithHTML(`Write the <code>/weather</code> to work with me!!`)
});

bot.help((ctx) => ctx.reply(help.commands));

// Function to get api & fetch it, we will use it to get the weather
async function fetchApi(city, key) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}&units=metric`;
    const response = await fetch(url);
    return await response.json();
}

// Our main command to get the weather
bot.command('weather', async (ctx) => {
    ctx.reply(`Hello, enter the city name and i'll give u the weather forecast!`)
    weatherContext = true
})

// Taking a last user message and checking if it's a city name
bot.on(`message`,  async(ctx) => {

    // Checking if user has written the /weather command
    if(ctx.message && !weatherContext) {
        ctx.replyWithHTML(`<b>Write command <code>/weather</code> to get forecast :D</b>`)
    }
    if(weatherContext) {
    // making context false to prevent the bot from sending the message again
    weatherContext = false

    const city = ctx.message.text;

    // fetching api
    const data = await fetchApi(city, process.env.API_TOKEN);

    //checking if city is not found
    if(data.cod === '404') {
        ctx.reply(`City not found, please write another one.`);
    }  else {

        //getting the data from the api
        const { weather, main, wind } = data;

        const { temp, feels_like, temp_min, temp_max, humidity } = main;
        const description = weather[0].description;
        const forecast = weather[0].main;
        const { speed } = wind;

        // making buttons with the text as a first parameter and data as a second
        await ctx.replyWithHTML(`<b>Forecast:</b>`, Markup.inlineKeyboard([
            [Markup.button.callback('Get temperature', 'temperature')],
            [Markup.button.callback('Get weather', 'weather')],
            [Markup.button.callback('Get wind', 'wind')],
        ]))

        // creating actions for buttons (with the data we've set before)
        await createAction('temperature', help.temperatureForecast(temp, feels_like, temp_min, temp_max, humidity))
        await createAction('weather', help.weatherForecast(forecast, description))
        await createAction('wind', help.windForecast(speed))

    }
    }
  })

// function to create actions for buttons
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
