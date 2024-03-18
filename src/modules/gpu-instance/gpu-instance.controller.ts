import { Controller, Get, Post, Put, Delete, Param, Body, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { GpuInstanceService } from './gpu-instance.service';
import { TrainingLogService } from 'src/modules/training-log/training-log.service';
import { GpuInstanceEntity } from './gpu-instance.entity';
import { TrainingLogEntity } from 'src/modules/training-log/training-log.entity';
import { CreateGpuInstanceDto } from './create-gpu-instance.dto';
import { UpdateGpuInstanceDto } from './update-gpu-instance.dto';

@ApiBearerAuth('BearerAuth')
@ApiTags('GpuInstances')
@Controller('gpuInstances')
export class GpuInstanceController {
  constructor(
    private gpuInstanceService: GpuInstanceService,
    private trainingLogService: TrainingLogService,
  ) {}

  /**
   * Get all trainingLogs by gpuInstances with pagination support.
   *
   * 
   * @param {number} gpuInstanceId - The gpuInstanceId of the trainingLog to retrieve.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering trainingLogs.
   * @returns {Promise<{ result: GpuInstanceEntity[]; total: number }>} - The list of gpuInstances and the total count.
   */
  @Get(':gpuInstanceId/trainingLog')
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Optional page for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Optional limit for pagination',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Optional search for searching',
  })
  async getTrainingLogsByGpuInstanceId(
    
    @Param('gpuInstanceId') gpuInstanceId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: TrainingLogEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.trainingLogService.getTrainingLogsByGpuInstanceId(
      
      gpuInstanceId,
      skip,
      itemsPerPage,
      search
    );
  }
  

  /**
   * Get all gpuInstances with pagination support.
   *
   * @param {Request} req - The Express request object.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering gpuInstances.
   * @returns {Promise<{ result: GpuInstanceEntity[]; total: number }>} - The list of gpuInstances and the total count.
   */
  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Optional page for pagination',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Optional limit for pagination',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Optional search for searching',
  })
  async getAllGpuInstances(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: GpuInstanceEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.gpuInstanceService.getAllGpuInstances(
      req.user.userId,
      skip,
      itemsPerPage,
      search
    );
  }

  /**
   * Get gpuInstance data for dropdowns.
   *
   * @param {Request} req - The Express request object.
   * @param {string} fields - Comma-separated list of fields to retrieve (optional).
   * @param {string} keyword - The keyword for filtering data (optional).
   * @returns {Promise<GpuInstanceEntity[]>} - The list of gpuInstance data for dropdowns.
   */
  @Get('dropdown')
  @ApiQuery({
    name: 'fields',
    required: false,
    type: String,
    description: 'Optional fields for filtering',
  })
  @ApiQuery({
    name: 'keyword',
    required: false,
    type: String,
    description: 'Optional keyword for filtering',
  })
  async getGpuInstanceDropdownData(
    @Req() req,
    @Query('fields') fields?: string,
    @Query('keyword') keyword?: string,
  ): Promise<GpuInstanceEntity[]> {
    const fieldArray = fields ? fields.split(',') : [
      'id',
      'name',
    ]
    return this.gpuInstanceService.findAllDropdownData(
      req.user.userId,
      fieldArray, 
      keyword
    );
  }

  /**
   * Get a gpuInstance by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the gpuInstance to retrieve.
   * @returns {Promise<GpuInstanceEntity>} - The gpuInstance object.
   */
  @Get(':id')
  async getGpuInstanceById(
    @Req() req,
    @Param('id') id: number
  ): Promise<GpuInstanceEntity> {
    return this.gpuInstanceService.getGpuInstanceById(
      req.user.userId,
      id
    );
  }

  /**
   * Create a new gpuInstance.
   *
   * @param {Request} req - The Express request object.
   * @param {CreateGpuInstanceDto} createGpuInstanceDto - The DTO for creating a gpuInstance.
   * @returns {Promise<GpuInstanceEntity>} - The newly created gpuInstance object.
   */
  @Post()
  async createGpuInstance(
    @Req() req,
    @Body() createGpuInstanceDto: CreateGpuInstanceDto
  ): Promise<GpuInstanceEntity> {
    return this.gpuInstanceService.createGpuInstance(
      req.user.userId,
      createGpuInstanceDto
    );
  }

  /**
   * Update an existing gpuInstance.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the gpuInstance to update.
   * @param {UpdateGpuInstanceDto} updateGpuInstanceDto - The DTO for updating a gpuInstance.
   * @returns {Promise<GpuInstanceEntity>} - The updated gpuInstance object.
   */
  @Put(':id')
  async updateGpuInstance(
    @Req() req,
    @Param('id') id: number,
    @Body() updateGpuInstanceDto: UpdateGpuInstanceDto,
  ): Promise<GpuInstanceEntity> {
    return this.gpuInstanceService.updateGpuInstance(
      req.user.userId,
      id, 
      updateGpuInstanceDto
    );
  }


  /**
   * Delete a gpuInstance by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the gpuInstance to delete.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteGpuInstance(
    @Req() req,
    @Param('id') id: number
  ): Promise<void> {
    return this.gpuInstanceService.deleteGpuInstance(
      req.user.userId,
      id
    );
  }
}
