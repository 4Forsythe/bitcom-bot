import { Context } from 'telegraf';

export interface ISessionData {
  userId: string;
  isSupportAskingQuestion: boolean;
}

export interface IBotContext extends Context {
  session: Partial<ISessionData>;
}
