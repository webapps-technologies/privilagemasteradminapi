import { Controller, Get } from '@nestjs/common';
// import { fcmMessanger } from 'src/utils/firebase-notify.utils';
import { NotifyService } from './notify.service';
@Controller('notify')
export class NotifyController {
  constructor(private readonly notifyService: NotifyService) {}

  @Get()
  async findAll() {
    // fcmMessanger(
    //   'doFjfyH4SSKdnGvnS7CQHs:APA91bEgXF2nzrzhsTTmS5808J9RsfBM6-RqJAxmMKjqsH5MJrnuiOTFOI-m2tD_CSZzAT_KoyXLnm86Qam8lyPRNZhOLj-KVM2C9v1BhsAyxf9QNpXzyLb5to9oAXmED5GzbiZIH3ku',
    //   'Title test',
    //   'Message test',
    // );
  }
}
