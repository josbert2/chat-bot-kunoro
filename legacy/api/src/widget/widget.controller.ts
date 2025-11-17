import { Controller, Post, Body, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { WidgetService } from './widget.service';
import { WidgetInitDto, WidgetMessageDto } from './dto/widget.dto';

@Controller('widget')
export class WidgetController {
  constructor(private readonly widgetService: WidgetService) {}

  @Post('init')
  @HttpCode(HttpStatus.OK)
  async init(
    @Headers('x-site-key') siteKey: string,
    @Body() body: WidgetInitDto,
  ) {
    return this.widgetService.init(siteKey, body);
  }

  @Post('messages')
  @HttpCode(HttpStatus.OK)
  async sendMessage(
    @Headers('x-site-key') siteKey: string,
    @Body() body: WidgetMessageDto & { pageUrl?: string; userAgent?: string },
  ) {
    return this.widgetService.sendMessage(siteKey, body);
  }

  @Post('offline')
  @HttpCode(HttpStatus.OK)
  async offlineForm(@Body() body: any) {
    return this.widgetService.handleOfflineForm(body);
  }
}

