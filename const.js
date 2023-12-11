const commands = `
/start - Restart the bot
/help - Help
/weather - get weather forecast
`

const greetings = `
I'm the weather bot! Please write the /weather or /help
and we will work together!
`

const temperatureForecast = (temp, feels_like, temp_min, temp_max, humidity) => {
    return `<b>Temperature info:</b>
    <i>Temperature: ${temp} C</i>
    <i>Feels like: ${feels_like} C</i>
    <i>Minimum temperature: ${temp_min} C</i>
    <i>Maximum temperature: ${temp_max} C</i>
    <i>Humidity: ${humidity} %</i>
    
    <b>Write the <code>/weather or /help</code> to continue work with me !</b>
`
}

const weatherForecast = (forecast, description) => {
    return `<b>Weather info:</b>
        <i>Forecast: ${forecast}</i>
        <i>Description: ${description}</i>
        <b>Write the <code>/weather or /help</code> to continue work with me !</b>
`
}

const windForecast = (speed) => {
    return `
        <b>Wind info:</b>
        <i>Speed: ${speed} m/s</i>
        <b>Write the <code>/weather or /help</code> to continue work with me !</b>
`
}

const fullForecast = (temp, feels_like, temp_min, temp_max, humidity, forecast, description, speed) => {
    return `<b>Full forecast:</b>
        <i>Temperature: ${temp} C</i>
        <i>Feels like: ${feels_like} C</i>
        <i>Minimum temperature: ${temp_min} C</i>
        <i>Maximum temperature: ${temp_max} C</i>
        <i>Humidity: ${humidity} %</i>
        <i>Forecast: ${forecast}</i>
        <i>Description: ${description}</i>
        <i>Speed: ${speed} m/s</i>
        <b>Write the <code>/weather or /help</code> to continue work with me !</b>
`
}

module.exports = {
    commands,
    greetings,
    temperatureForecast,
    weatherForecast,
    windForecast,
    fullForecast
}