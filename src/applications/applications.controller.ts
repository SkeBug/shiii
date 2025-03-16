import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req, HttpCode, HttpStatus } from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationRequest } from './dto/create-application-request.dto';
import { UpdateApplicationRequest } from './dto/update-application-request.dto';
import { ReadAllApplicationsResponse } from './dto/read-all-applications-response.dto';
import { ApiParam, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { ReadOneApplicationResponse } from './dto/read-one-application-response.dto';

@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  create(@Body() createApplicationDto: CreateApplicationRequest) {
    return this.applicationsService.create(createApplicationDto);
  }

  @Get()
  @ApiQuery({ name: 'page', description: 'The page number', required: false, example: 1 })
  @ApiQuery({ name: 'limit', description: 'The number of items per page', required: false, example: 10 })
  @ApiQuery({ name: 'name', description: 'Name of the application to search (can return multiple results)', required: false, example: 'SB24' })
  @ApiQuery({ name: 'description', description: 'Description of the application (can be partial)', required: false, example: 'The internet banking' })
  @ApiQuery({
    name: 'orderBy',
    required: false,
    examples: {
      name: { summary: 'name', description: 'Order by applications name', value: 'name' },
      description: { summary: 'description', description: 'Order by applications description', value: 'description' },
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
  @ApiResponse({ status: 200, description: 'Applications found', type: ReadAllApplicationsResponse })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('name') name: string,
    @Query('description') description: string,
    @Query('orderBy') orderBy: string,
    @Query('orderByAscOrDesc') orderByAscOrDesc: string,
    @Req() request: any
  ): Promise<ReadAllApplicationsResponse> {
    return this.applicationsService.findAll();
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    description: 'The application ID (UUID)',
    example: 'f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d'
  })
  @ApiResponse({ status: 200, description: 'Application found', type: ReadOneApplicationResponse })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async findOne(@Param('id') id: string): Promise<ReadOneApplicationResponse> {
    return this.applicationsService.findOne(id);
  }

  @Patch(':id')
  @ApiParam({
    name: 'id',
    description: 'The application ID (UUID)',
    example: 'f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d'
  })
  @ApiResponse({ status: 200, description: 'Application updated' })
  @ApiResponse({ status: 404, description: 'Resource not found' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  update(
    @Param('id') id: string, 
    @Body() updateApplicationDto: UpdateApplicationRequest
  ) {
    return this.applicationsService.update(id, updateApplicationDto);
  }

  @Delete(':id')
  @ApiParam({
    name: 'id',
    description: 'The application ID (UUID)',
    example: 'f3d1b3e8-6f4e-4f9a-8d4e-8d3f3e8d4e8d'
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Application removed' })
  remove(@Param('id') id: string) {
    return this.applicationsService.remove(+id);
  }
}
