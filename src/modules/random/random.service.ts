import { Injectable } from '@nestjs/common';

import { CODE_POSSIBLE_CHARS } from '../../common/constants';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const randomNumber = require('random-number-csprng');

@Injectable()
export class RandomService {
  async generateRandomString(len: number): Promise<string> {
    let result = '';
    for (let i = 0; i < len; i++) {
      const trueRandom = await randomNumber(0, CODE_POSSIBLE_CHARS.length - 1);
      result += CODE_POSSIBLE_CHARS.charAt(trueRandom);
    }
    return result;
  }
}
