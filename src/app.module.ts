import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { OrdersModule } from './domains/orders/orders.module';
import { SeedModule } from './domains/seed/seed.module';
import { UsersModule } from './domains/users/users.module';
import { AppGateway } from './app.gateway';
import { AppController } from './app.controller';
import { APP_GUARD } from '@nestjs/core';
import { CustomAuthGuard } from './shared/guards';
import { RequestMiddleware } from './shared/middlewares';

@Module({
  imports: [
    OrdersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      expandVariables: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('MONGODB_URI')
      })
    }),
    SeedModule,
    SharedModule,
    UsersModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppGateway,
    { provide: APP_GUARD, useClass: CustomAuthGuard }
  ]
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestMiddleware).forRoutes('*');
  }
}
