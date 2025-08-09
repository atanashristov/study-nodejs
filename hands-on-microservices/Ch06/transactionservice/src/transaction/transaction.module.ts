import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule], // Import PrismaModule to use Prisma Client
  controllers: [TransactionController],
  providers: [TransactionService],
})
export class TransactionModule { }
