import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, OrderItem, OrderItemSchema, OrderSchema } from './schemas';
import { UtilsModule } from 'src/utils/utils.module';
import { SeedModule } from '../seed/seed.module';
import { OrdersGateway } from './orders.gateway';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: OrderItem.name, schema: OrderItemSchema }
    ]),
    UtilsModule,
    UsersModule,
    SeedModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService, OrdersGateway]
})
export class OrdersModule {}
