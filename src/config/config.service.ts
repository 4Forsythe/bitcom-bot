import { type IConfigService } from './config.interface';
import { type DotenvParseOutput, config } from 'dotenv';

export class ConfigService implements IConfigService {
  private config: DotenvParseOutput;

  constructor() {
    const { parsed, error } = config();

    if (error) {
      throw new Error('Cannot find or configure .env file');
    }
    if (!parsed) {
      throw new Error('Found empty .env file that cannot be parsed');
    }
    this.config = parsed;
  }

  get(key: string): string {
    const value = this.config[key];

    if (!value) {
      throw new Error(`Cannot read value of [${key}] environment`);
    }

    return value;
  }
}
