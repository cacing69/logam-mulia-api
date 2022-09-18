import { DefinerService } from './definer/definer.service';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { nanoid } from 'nanoid';

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService, private definerService: DefinerService) {}
  getResponse(): object {
    return {
      message: 'Logam Mulia API',
      data: {
        app: 'api',
        ver: '1.0.0',
        env: {
          node_env: this.configService.get('APP_MODE'),
        },
        contributors: ['@cacing69'],
      },
      extra: null,
      code: '20000',
      meta: {
        requestId: nanoid(),
        availablePath: [
          {
            method: 'get',
            path: 'prices/:site',
            params: {
              name: "site",
              type: "string",
              value: this.definerService.getKey()
            },
          },
          {
            method: 'get',
            path: 'sites',
          },
        ],
      },
    };
  }
}
