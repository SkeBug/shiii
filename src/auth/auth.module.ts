import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from 'src/database/prisma/prisma.service';

@Module({
  controllers: [],
  providers: [
    AuthService,
    PrismaService,
  ]
})
export class AuthModule {}
