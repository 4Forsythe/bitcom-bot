import { Telegraf, Markup } from 'telegraf';
import type { InlineKeyboardButton } from 'telegraf/typings/core/types/typegram';

import { type IBotContext } from '@/context';
import { type IConfigService } from '@/config';

import { Command } from './command.class';

export class SupportCommand extends Command {
  private readonly superchats: number[] = [];

  constructor(
    bot: Telegraf<IBotContext>,
    private readonly configService: IConfigService
  ) {
    super(bot);

    this.superchats = [
      ...new Set(
        this.configService.get('SUPERCHAT_IDS').split(',').map(Number)
      ),
    ];
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

    this.bot.on('message', (ctx) => {
      if (!ctx.session || !ctx.session.isSupportAskingQuestion) return;

      Promise.all(this.superchats.map((chatId) => ctx.forwardMessage(chatId)));

      ctx.reply(
        'Я передал ваше сообщение менеджеру. Как только получу ответ, вернусь в чат!'
      );
    });
  }
}
