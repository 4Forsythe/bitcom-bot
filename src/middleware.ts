import { type IBotContext } from '@/context';
import { type IConfigService, ConfigService } from './config';

const configService: IConfigService = new ConfigService();

const SUPERCHAT_IDS = configService.get('SUPERCHAT_IDS');
const SUPERCHATS = SUPERCHAT_IDS.split(',').map(Number) || [];

export function middleware(ctx: IBotContext, next: () => void) {
  if (!ctx.chat) {
    console.warn(`Middleware: Chat is missing...`);
    return;
  }

  if (!SUPERCHATS.includes(ctx.chat.id)) {
    return ctx.reply('Извините, но эта команда вам недоступна.');
  }

  return next();
}
