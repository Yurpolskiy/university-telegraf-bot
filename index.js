const {Telegraf, Markup} = require('telegraf')
require('dotenv').config()
const help = require('./const.js')

const bot = new Telegraf(process.env.BOT_TOKEN)
bot.start((ctx) => ctx.reply(`Hello, ${ctx.message.from.first_name ? ctx.message.from.first_name : 'innocent'}!`))
bot.help((ctx) => ctx.reply(help.commands))

bot.command('course', async (ctx) => {
    try {
        await ctx.replyWithHTML('<b>Choose your course:</b>', Markup.inlineKeyboard(
    [
            [Markup.button.callback('Gay Button', 'gay')]
        ]
    ))
    } catch (error) {
        console.log(error)
    }
})

function addActionBot(name, src, text) {
    bot.action(name, async(ctx) => {
        try {
            await ctx.answerCbQuery()
            if(src) {
                await ctx.replyWithPhoto(src, {
                  source: src
                })
            }
            await ctx.replyWithHTML(text,{
                disable_web_page_preview: true
            })
        } catch(error) {
            console.log(error)
        }
    })
}

addActionBot('gay', null, 'Sex with hitler')
// bot.action('gay', async(ctx) => {
//     try {
//         await ctx.answerCbQuery()
//         await ctx.replyWithHTML('Lublu v jopu',{
//             disable_web_page_preview: true
//         })
//     } catch(error) {
//         console.log(error)
//     }
// })

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))