import { Telegraf } from 'telegraf';
import { PrismaClient } from '@prisma/client';
import { message } from 'telegraf/filters';
import * as dotenv from 'dotenv';
import json from "./json/banned.json" assert { type: "json" };

dotenv.config();

const prisma = new PrismaClient();
const bot = new Telegraf(process.env.BOT_TOKEN);
let response = '';

bot.on('message', async (ctx) => {
    if ("caption" in ctx.update.message) {
        response = ctx.update.message.caption;
    } else if ("text" in ctx.update.message) {
        response = ctx.update.message.text.toLowerCase();
    } else {
        return;
    }

    for (let item of json.block) {
        if (response.includes(item.text) || response == item.text) {
            await ctx.deleteMessage();
            return;
        }
    }
});

bot.hears(message('hi'), async (ctx) => {
    ctx.reply('Cuidado!');

    console.log(ctx.update);

    // const user = await prisma.user.create({
    //     data: {
    //         name: 'Alice',
    //         email: 'alice@prisma.io',
    //     },
    // })

});


bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));