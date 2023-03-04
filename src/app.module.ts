import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MONGODB_URI } from './constants';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    OrdersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true
    }),
    MongooseModule.forRoot(MONGODB_URI)
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
