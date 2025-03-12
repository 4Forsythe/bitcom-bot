import { Telegraf, session } from 'telegraf';
import { ConfigService, type IConfigService } from './config';

import { type IBotContext } from './context';
import { Command, StartCommand, SupportCommand } from './commands';

class Bot {
  bot: Telegraf<IBotContext>;
  commands: Command[] = [];

  constructor(private readonly configService: IConfigService) {
    const token = this.configService.get('BOT_TOKEN');

    this.bot = new Telegraf<IBotContext>(token);
    this.bot.use(session());
  }

  init() {
    this.commands = [
      new StartCommand(this.bot),
      new SupportCommand(this.bot, this.configService),
    ];

    for (const command of this.commands) {
      command.handle();
    }

    this.bot.launch();
    console.log('Bot is running...');

    process.once('SIGINT', () => this.stop('SIGINT'));
    process.once('SIGTERM', () => this.stop('SIGTERM'));
  }

  stop(reason: string) {
    this.bot.stop(reason);
    console.log(`Stopping bot due to ${reason} reason`);
  }
}

const bot = new Bot(new ConfigService());
bot.init();
