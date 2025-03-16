import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth/auth.controller';
import { PrismaService } from './database/prisma/prisma.service';
import { AuthService } from './auth/auth.service';
import { JwtStrategy } from './auth/jwt.strategy';
import { AccountTypesModule } from './account-types/account-types.module';
import { ApplicationsModule } from './applications/applications.module';

@Module({
  imports: [
    UsersModule, 
    AuthModule,
    PassportModule,
    JwtModule.register({
      secret: 'secret',
      signOptions: { expiresIn: '1h' }, 
    }),
    AccountTypesModule,
    ApplicationsModule,
  ],
  controllers: [
    AuthController,
  ],
  providers: [
    AuthService,
    PrismaService,
    JwtStrategy
  ],
})
export class AppModule {}

/*
* Here is founded all general TODOs comments in the project
*/
// TODO: Revisite the controllers and put the correct response status code for each method