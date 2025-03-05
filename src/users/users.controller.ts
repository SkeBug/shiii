import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus, Res, UseGuards, Req } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create.user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReadAllUsersDto } from './dto/read-all-users.dto';
import { ReadOneUserDto } from './dto/read-one-user.dto';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { ApiQuery } from '@nestjs/swagger';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) { }

  // @Roles('Admin', 'Manager')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('user')
  async create(@Res() response: FastifyReply, @Body() createUserDto: CreateUserDto) {
    try {
      const user = await this.usersService.create(createUserDto);
      return response.status(HttpStatus.CREATED).send(user);
    } catch (error) {
      response.status(HttpStatus.BAD_REQUEST).send({ message: error.message });
      throw error;
    }
  }

  // @Roles('Admin', 'Manager')
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  @Get('users')
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'email', required: false })
  @ApiQuery({ name: 'orderBy', required: false })
  @ApiQuery({ name: 'orderByAscOrDesc', required: false })
  readAllUsers(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('orderBy') orderBy: string,
    @Query('orderByAscOrDesc') orderByAscOrDesc: string,
    @Req() req: any
  ): Promise<ReadAllUsersDto> {
    const params = {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      orderBy: orderBy ? orderBy : 'createdAt',
    };

    return this.usersService.readAllUsers({
      ...params,
      where: {
        // id: req.user.userId ? { not: req.user.userId } : undefined,
        name: name ? { contains: name } : undefined,
        email: email ? { contains: email } : undefined,
        // managerId: req.user.role === 'Admin' ? undefined : req.user.userId,
        active: true,
      },
      orderBy: {
        [params.orderBy]: orderByAscOrDesc === 'asc' ? 'asc' : 'desc'
      },
    });
  }

//   @Roles('Admin', 'Manager')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Get('user/:id')
//   async findOne(
//     @Res() response: FastifyReply,
//     @Param('id') id: string
//   ): Promise<ReadOneUserDto | null | string> {
//     try {
//       const user = await this.usersService.findOne(id);
//       if (!user) {
//         return response.status(HttpStatus.NOT_FOUND).send('User not found');
//       }
//       return response.status(HttpStatus.OK).send(user);
//     } catch (error) {
//       return response.status(HttpStatus.BAD_REQUEST).send({ message: error.message });
//     }
//   }

//   @Roles('Admin', 'Manager')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Patch('user/:id')
//   update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
//     if (Object.keys(updateUserDto).length === 0) {
//       throw new HttpException("No data to update", HttpStatus.NO_CONTENT);
//     }

//     return this.usersService.update(id, updateUserDto);
//   }

//   @Roles('Admin', 'Manager')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Post('user/applications/:id')
//   async createUserApplications(
//     @Res() response: FastifyReply,
//     @Param('id') id: string,
//     @Body() createUserApplicationsDto: CreateUserApplicationsDto
//   ) {
//     try {
//       await this.usersService.createUserApplications(id, createUserApplicationsDto);
//       return response.status(HttpStatus.CREATED).send({ message: 'Applications created successfully' });
//     } catch (error) {
//       return response.status(HttpStatus.BAD_REQUEST).send({ message: error.message });
//     }
//   }

//   /*
//     This endpoint don´t have pagination at the request of the frontend developer
//   */
//   // TODO: implement order by
//   @Roles('Admin', 'Manager')
//   @UseGuards(JwtAuthGuard, RolesGuard)
//   @Get('users/managers')
//   async findAllManagers(
//   ) {
//     return this.usersService.findAllManagers();
//   }
}
