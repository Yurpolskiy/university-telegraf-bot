const commands = `
/start - Restart the bot
/help - Help
/weather - weather forecast
`

const greetings = `
I'm the weather bot! Please write the city
and i'll give u the weather forecast!
`

const temperatureForecast = (temp, feels_like, temp_min, temp_max, humidity) => {
    return `<b>Temperature info:</b>
    <i>Temperature: ${temp} C</i>
    <i>Feels like: ${feels_like} C</i>
    <i>Minimum temperature: ${temp_min} C</i>
    <i>Maximum temperature: ${temp_max} C</i>
    <i>Humidity: ${humidity} %</i>
`
}

const weatherForecast = (forecast, description) => {
    return `<b>Weather info:</b>
        <i>Forecast: ${forecast}</i>
        <i>Description: ${description}</i>`
}

const windForecast = (speed) => {
    return `<b>Wind info:</b>
        <i>Speed: ${speed} m/s</i>`
}

module.exports = {
    commands,
    greetings,
    temperatureForecast,
    weatherForecast,
    windForecast
}