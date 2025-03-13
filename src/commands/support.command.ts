import { Telegraf, Markup } from 'telegraf';
import type { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';

import { type IBotContext } from '@/context';

import { Command } from './command.class';

export class SupportCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  private buttons: InlineKeyboardButton[] = [
    Markup.button.callback('Задать вопрос менеджеру', 'ask_question'),
  ];

  private init(ctx: IBotContext) {
    const username =
      ctx.message && (ctx.message.from.first_name || ctx.message.from.username);

    ctx.replyWithHTML(
      `<b>Чем я могу вам помочь, ${username}?</b>\n\nЭто специальный раздел для оказания технической поддержки любой сложности: товар, возврат, услуга, доставка, индивидуальная помощь\n\nПожалуйста, выберите один из вариантов ниже, чтобы я понял в чем заключается ваша проблема`,
      Markup.inlineKeyboard(this.buttons)
    );
  }

  handle(): void {
    this.bot.command('support', (ctx) => {
      this.init(ctx);
    });

    this.bot.action('ask_question', (ctx) => {
      if (!ctx.session) ctx.session = {};
      ctx.reply('Пожалуйста, опишите свою проблему');
      ctx.session.isSupportAskingQuestion = true;
    });
  }
}
