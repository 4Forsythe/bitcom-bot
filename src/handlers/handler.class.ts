import { Telegraf } from 'telegraf';
import { type IBotContext } from '@/context';

export abstract class Handler {
  constructor(public bot: Telegraf<IBotContext>) {}

  abstract init(): void;
}
