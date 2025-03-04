import { Telegraf, Markup } from 'telegraf';
import { type IBotContext } from '@/context';

import { Command } from './command.class';

export class StartCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  private buttons = [];

  private init(ctx: IBotContext) {
    ctx.reply('Привет, я бот!', Markup.inlineKeyboard(this.buttons));
  }

  handle(): void {
    this.bot.start((ctx) => {
      this.init(ctx);
    });
  }
}
