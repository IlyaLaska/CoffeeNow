import * as fs from 'fs';

import { ConfigService } from './src/common/modules/config/config.service';
const configService = new ConfigService();

const FILE_NAME = 'ormconfig.json';

if (fs.existsSync(FILE_NAME)) {
  fs.unlinkSync(FILE_NAME);
}
fs.writeFileSync(
  FILE_NAME,
  JSON.stringify(
    {
      ...configService.ormConfig,
      entities: ['src/**/*.entity.ts'],
      migrations: ['src/migration/*.ts'],
      synchronize: false,
    },
    null,
    2,
  ),
);
