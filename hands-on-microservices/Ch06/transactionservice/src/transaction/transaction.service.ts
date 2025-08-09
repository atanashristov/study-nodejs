import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) { }

  create(createTransactionDto: CreateTransactionDto) {
    return this.prisma.transaction.create({
      data: { ...createTransactionDto, status: 'CREATED' },
    });
  }

  findAll() {
    return this.prisma.transaction.findMany();
  }

  findOne(id: number) {
    return this.prisma.transaction.findUnique({
      where: { id },
    });
  }
}
