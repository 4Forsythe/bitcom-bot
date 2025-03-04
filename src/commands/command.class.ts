import { Telegraf } from 'telegraf';
import { type IBotContext } from '@/context';

export abstract class Command {
  constructor(public bot: Telegraf<IBotContext>) {}

  abstract handle(): void;
}
