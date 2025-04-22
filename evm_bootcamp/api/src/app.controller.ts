import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('token-name')
  async getTokenName(): Promise<string> {
    return await this.appService.getTokenName();
  }

  @Get('mint-and-prepare')
  async mintAndPrepare(@Query('address') address: string): Promise<string> {
    try {
      return await this.appService.mintAndPrepare(address as `0x${string}`);
    } catch (err) {
      console.error('❌ Error in mintAndPrepare route:', err);
      throw err;
    }
  }
}
