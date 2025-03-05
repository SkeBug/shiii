import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { AuthService } from './auth.service';
import { AuthenticateDto } from './dto/authenticate.dto';
import { JwtAuthGuard } from './jwt.guard';
import { Roles } from './roles/roles.decorator';
import { RolesGuard } from './roles/roles.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Res() res: FastifyReply, @Body() authenticateDto: AuthenticateDto) {
        try {
            const response = await this.authService.authenticate(authenticateDto);
            return res.status(HttpStatus.OK).send(response);
        } catch (error) {
            res.status(HttpStatus.UNAUTHORIZED).send({ message: error.message });
            throw error;
        }
    }

    @Roles('Member')   
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('profile')
    async profile(
        @Res() res: any, 
        @Req() req: any
    ) {
        return res.status(HttpStatus.OK).send(req.user)
    }
}
