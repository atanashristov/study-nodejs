import { IsString, IsOptional, IsEnum, IsNotEmpty, IsUUID }
  from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTransactionDto {
  @IsUUID()
  @IsNotEmpty()
  @ApiProperty()
  accountId: string;

  @IsOptional()
  @IsString()
  @ApiProperty()
  description?: string;
}
