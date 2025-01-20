import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AuthModule } from "src/auth/auth.module";
// import { NodeMailerModule } from "src/node-mailer/node-mailer.module";
import { PaymentHistory } from "./entities/payment-history.entity";
import { PaymentHistoryController } from "./payment-history.controller";
import { PaymentHistoryService } from "./payment-history.service";
import { NotifyModule } from "src/notify/notify.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentHistory]),
    AuthModule,
    // NodeMailerModule,
    NotifyModule
  ],
  controllers: [PaymentHistoryController],
  providers: [PaymentHistoryService],
  exports: [PaymentHistoryService],
})
export class PaymentHistoryModule {}
