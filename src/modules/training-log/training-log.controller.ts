import { Controller, Get, Post, Put, Delete, Param, Body, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { TrainingLogService } from './training-log.service';
import { TrainingLogEntity } from './training-log.entity';
import { CreateTrainingLogDto } from './create-training-log.dto';
import { UpdateTrainingLogDto } from './update-training-log.dto';

@ApiBearerAuth('BearerAuth')
@ApiTags('TrainingLogs')
@Controller('trainingLogs')
export class TrainingLogController {
  constructor(
    private trainingLogService: TrainingLogService,
  ) {}


  /**
   * Get all trainingLogs with pagination support.
   *
   * 
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering trainingLogs.
   * @returns {Promise<{ result: TrainingLogEntity[]; total: number }>} - The list of trainingLogs and the total count.
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
  async getAllTrainingLogs(
    
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: TrainingLogEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.trainingLogService.getAllTrainingLogs(
      
      skip,
      itemsPerPage,
      search
    );
  }

  /**
   * Get trainingLog data for dropdowns.
   *
   * 
   * @param {string} fields - Comma-separated list of fields to retrieve (optional).
   * @param {string} keyword - The keyword for filtering data (optional).
   * @returns {Promise<TrainingLogEntity[]>} - The list of trainingLog data for dropdowns.
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
  async getTrainingLogDropdownData(
    
    @Query('fields') fields?: string,
    @Query('keyword') keyword?: string,
  ): Promise<TrainingLogEntity[]> {
    const fieldArray = fields ? fields.split(',') : [
      'id',
    ]
    return this.trainingLogService.findAllDropdownData(
      
      fieldArray, 
      keyword
    );
  }

  /**
   * Get a trainingLog by ID.
   *
   * 
   * @param {number} id - The id of the trainingLog to retrieve.
   * @returns {Promise<TrainingLogEntity>} - The trainingLog object.
   */
  @Get(':id')
  async getTrainingLogById(
    
    @Param('id') id: number
  ): Promise<TrainingLogEntity> {
    return this.trainingLogService.getTrainingLogById(
      
      id
    );
  }

  /**
   * Create a new trainingLog.
   *
   * 
   * @param {CreateTrainingLogDto} createTrainingLogDto - The DTO for creating a trainingLog.
   * @returns {Promise<TrainingLogEntity>} - The newly created trainingLog object.
   */
  @Post()
  async createTrainingLog(
    
    @Body() createTrainingLogDto: CreateTrainingLogDto
  ): Promise<TrainingLogEntity> {
    return this.trainingLogService.createTrainingLog(
      
      createTrainingLogDto
    );
  }

  /**
   * Update an existing trainingLog.
   *
   * 
   * @param {number} id - The id of the trainingLog to update.
   * @param {UpdateTrainingLogDto} updateTrainingLogDto - The DTO for updating a trainingLog.
   * @returns {Promise<TrainingLogEntity>} - The updated trainingLog object.
   */
  @Put(':id')
  async updateTrainingLog(
    
    @Param('id') id: number,
    @Body() updateTrainingLogDto: UpdateTrainingLogDto,
  ): Promise<TrainingLogEntity> {
    return this.trainingLogService.updateTrainingLog(
      
      id, 
      updateTrainingLogDto
    );
  }


  /**
   * Delete a trainingLog by ID.
   *
   * 
   * @param {number} id - The id of the trainingLog to delete.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteTrainingLog(
    
    @Param('id') id: number
  ): Promise<void> {
    return this.trainingLogService.deleteTrainingLog(
      
      id
    );
  }
}
