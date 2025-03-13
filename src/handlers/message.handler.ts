import { Telegraf } from 'telegraf';
import { type IBotContext } from '@/context';
import { type IConfigService } from '@/config';

import { Handler } from './handler.class';

export class MessageHandler extends Handler {
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

  init() {
    this.bot.on('message', async (ctx) => {
      if (!ctx.message || !('text' in ctx.message)) return;

      if (ctx.session && ctx.session.isSupportAskingQuestion) {
        await this.handleSupportAskingQuestion(ctx);
      }
    });
  }

  private async handleSupportAskingQuestion(ctx: IBotContext) {
    if (!ctx.session || !ctx.session.isSupportAskingQuestion) return;

    Promise.all(this.superchats.map((chatId) => ctx.forwardMessage(chatId)));

    ctx.reply(
      'Я передал ваше сообщение менеджеру. Как только получу ответ, вернусь в чат!'
    );
  }
}
