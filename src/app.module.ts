import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppService } from './app.service';
import { MONGODB_URI } from './constants';
import { OrdersModule } from './domains/orders/orders.module';
import { SeedModule } from './domains/seed/seed.module';
import { UtilsModule } from './utils/utils.module';
import { UsersModule } from './domains/users/users.module';
import { AppGateway } from './app.gateway';
import { AppController } from './app.controller';

@Module({
  imports: [
    OrdersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true
    }),
    MongooseModule.forRoot(MONGODB_URI),
    SeedModule,
    UtilsModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [AppService, AppGateway]
})
export class AppModule {}
