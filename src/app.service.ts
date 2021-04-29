import { Injectable } from '@nestjs/common';
import * as appRoot from 'app-root-path';
import * as fs from 'fs';
const packageJson = JSON.parse(fs.readFileSync(`${appRoot.toString()}/package.json`, 'utf8'));
const healthResponse = JSON.stringify(
  {
    version: packageJson.version,
    description: packageJson.description,
    author: packageJson.author,
  },
  null,
  2,
);

@Injectable()
export class AppService {
  health(): string {
    return healthResponse;
  }
}
