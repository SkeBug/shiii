import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpException, HttpStatus, Res, UseGuards, Req } from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UpdateUserRequest } from './dto/update-user-request.dto';
import { CreateUserRequest } from './dto/create-user-request.dto';
import { ReadAllUsersResponse } from './dto/read-all-users-response.dto';
import { ReadOneUserResponse } from './dto/read-one-user-response.dto';

@Controller()
export class UsersController {
  constructor(
    private readonly usersService: UsersService
  ) { }

  // @Roles('Admin', 'Manager')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('user')
  async create(@Res() response: FastifyReply, @Body() userRequest: CreateUserRequest) {
    try {
      const user = await this.usersService.create(userRequest);
      return response.status(HttpStatus.CREATED).send(user);
    } catch (error) {
      response.status(HttpStatus.BAD_REQUEST).send({ message: error.message });
      throw error;
    }
  }

  // @Roles('Admin', 'Manager')
  // @UseGuards(JwtAuthGuard, RolesGuard) 
  //examples?: Record<string, ExampleObject | ReferenceObject>;
  @Get('users')
  @ApiQuery({ name: 'page', description: 'The page number', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'The number of items per page', required: false, example: 10 })
  @ApiQuery({ name: 'name', description: 'Name of the user to search (can return multiple results)', required: false, example: 'John Doe' })
  @ApiQuery({ name: 'email', description: 'Email of the user', required: false, example: 'email.teste@standardbank.co.ao'})
  @ApiQuery({ 
    name: 'orderBy', 
    required: false, 
    examples: {
      externalId: { summary: 'externalId', description: 'External identifier of the user', value: 'externalId' },
      name: { summary: 'name', description: 'Name of the user', value: 'name' },
      email: { summary: 'email', description: 'Email of the user', value: 'email' },
      createdAt: { summary: 'createdAt', description: 'Creation date of the user', value: 'createdAt' },
      updatedAt: { summary: 'updatedAt', description: 'Update date of the user', value: 'updatedAt' },
    }
  })
  @ApiQuery({ 
    name: 'orderByAscOrDesc', 
    required: false,
    examples: {
      asc: { summary: 'asc', description: 'Ascending order', value: 'asc' },
      desc: { summary: 'desc', description: 'Descending order', value: 'desc' },
    }
  })
  @ApiResponse({ status: 200, description: 'Users found', type: ReadAllUsersResponse })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  readAllUsers(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('name') name: string,
    @Query('email') email: string,
    @Query('orderBy') orderBy: string,
    @Query('orderByAscOrDesc') orderByAscOrDesc: string,
    @Req() req: any
  ): Promise<ReadAllUsersResponse> {
    const params = {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      orderBy: orderBy || 'createdAt',
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

  // @Roles('Admin', 'Manager')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Get('user/:id')
  @ApiParam({ 
    name: 'id', 
    description: 'The user identifier (UUID - Internal Id)', 
    required: true, 
    example: 'f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d' 
  })
  @ApiResponse({ status: 200, description: 'User found', type: ReadOneUserResponse })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async findOne(
    @Param('id') id: string,
    @Res() response: FastifyReply,
  ): Promise<ReadOneUserResponse | null | string> {
    try {
      const user = await this.usersService.findOne(id);
      if (!user) {
        return response.status(HttpStatus.NOT_FOUND).send('User not found');
      }
      return response.status(HttpStatus.OK).send(user);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send({ message: error.message });
    }
  }

  // @Roles('Admin', 'Manager')
  // @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('user/:id')  
  @ApiParam({ 
    name: 'id', 
    description: 'The user identifier (UUID - Internal Id)', 
    required: true,
    example: 'f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d'
  })
  @ApiResponse({ status: 200, description: 'User updated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  update(
    @Param('id') id: string, 
    @Body() updateUserRequest : UpdateUserRequest
  ) {
    if (Object.keys(updateUserRequest).length === 0) {
      throw new HttpException("No data to update", HttpStatus.NO_CONTENT);
    }

    return this.usersService.update(id, updateUserRequest);
  }

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
