import { Injectable, NotFoundException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { AuthenticateDto } from './dto/authenticate.dto';
import { IAuthenticate } from './interfaces/user.interface';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { sign } from 'jsonwebtoken';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService) { }

    async authenticate(authenticate: AuthenticateDto): Promise<IAuthenticate> {

        const user = await this.prisma.user.findUnique({
            where: {
                email: authenticate.userEmail
            }
        });

        if (!user) throw new NotFoundException('User not found');

        if (user.password) {
            const passwordMatch = await argon2.verify(user.password, authenticate.password);

            if (!passwordMatch) throw new NotFoundException('Password does not match');
        }

        const role = await this.prisma.role.findUnique({
            where: {
                id: user.roleId
            }
        });

        const token = sign({
            id: user.id,
            email: user.email,
            name: user.name,
            role: role?.name,
            active: user.active,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }, 'secret');

        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: role?.name,
                active: user.active,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt
            },
            token
        };
    }
}
