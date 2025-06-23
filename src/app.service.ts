import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHelo() {
    return 'Hello World';
  }
}
