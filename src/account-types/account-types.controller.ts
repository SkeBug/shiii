import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, Res, HttpStatus, HttpException, HttpCode } from '@nestjs/common';
import { AccountTypesService } from './account-types.service';
import { UpdateAccountTypeRequest } from './dto/update-account-type-response.dto';
import { CreateAccountTypeRequest } from './dto/create-account-type-request.dto';
import { ReadAllAccountTypesResponse } from './dto/read-all-account-types-response.dto';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { FastifyReply } from 'fastify';
import { ReadOneAccountTypesResponse } from './dto/read-one-account-types-response.dto';

@Controller('account-types')
export class AccountTypesController {
  constructor(private readonly accountTypesService: AccountTypesService) { }

  @Post()
  async create(@Body() createAccountTypeRequest: CreateAccountTypeRequest) {
    return this.accountTypesService.create(createAccountTypeRequest);
  }

  @Get()
  @ApiQuery({ name: 'page', description: 'The page number', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'The number of items per page', required: false, example: 10 })
  @ApiQuery({ name: 'name', description: 'Name of the account type to search (can return multiple results)', required: false, example: 'EA' })
  @ApiQuery({ name: 'description', description: 'Description of the account type (can be partial)', required: false, example: 'Elevated Account' })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    examples: {
      name: { summary: 'name', description: 'Order by account types name', value: 'name' },
      description: { summary: 'description', description: 'Order by account types description', value: 'description' },
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
  @ApiResponse({ status: 200, description: 'Account types found', type: ReadAllAccountTypesResponse })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('name') name: string,
    @Query('description') description: string,
    @Query('orderBy') orderBy: string,
    @Query('orderByAscOrDesc') orderByAscOrDesc: string,
    @Req() request: any
  ): Promise<ReadAllAccountTypesResponse> {
    return this.accountTypesService.findAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'The account type ID (UUID)',
    example: 'f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d'
  })
  @ApiResponse({ status: 200, description: 'Account type found', type: ReadOneAccountTypesResponse })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async findOne(
    @Param('id') id: string,
    @Res() response: FastifyReply
  ): Promise<ReadOneAccountTypesResponse | null | string> {
    try {
      const accountType = await this.accountTypesService.findOne(id);

      if (!accountType) {
        return response.status(HttpStatus.NOT_FOUND).send('Account type not found');
      }

      return response.status(HttpStatus.OK).send(accountType);
    } catch (error) {
      return response.status(HttpStatus.BAD_REQUEST).send({ message: error.message });
    }
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'The account type ID (UUID)',
    example: 'f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d'
  })
  @ApiResponse({ status: 200, description: 'Account type updated' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  update(
    @Param('id') id: string,
    @Body() updateAccountTypeRequest: UpdateAccountTypeRequest
  ) {
    if (Object.keys(UpdateAccountTypeRequest).length === 0) {
      throw new HttpException("No data to update", HttpStatus.NOT_FOUND);
    }

    return this.accountTypesService.update(id, updateAccountTypeRequest);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'The account type ID (UUID)',
    example: 'f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d'
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Account type removed' })
  remove(@Param('id') id: string) {
    return this.accountTypesService.remove(id);
  }
}
