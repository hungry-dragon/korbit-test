import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

@Injectable()
export class EnvConfigService {
  public readonly zone: string;
  public readonly isLocalDev: boolean;
  public readonly database: TypeOrmModuleOptions;

  constructor(private readonly configService: ConfigService) {
    this.zone = this.configService.get<string>('ZONE');
    this.isLocalDev = this.zone == 'local';
    this.database = this.getDatabase(this.isLocalDev);
  }

  private getDatabase(isLocal: boolean): TypeOrmModuleOptions {
    if (isLocal) {
      return {
        type: 'sqlite',
        database: ':memory:',
        synchronize: true,
        logging: true,
        dropSchema: true,
      };
    }

    throw new Error('todo: prod & dev env');
  }
}
