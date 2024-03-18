import { Controller, Get, Post, Put, Delete, Param, Body, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { ModelService } from './model.service';
import { TrainingLogService } from 'src/modules/training-log/training-log.service';
import { ModelEntity } from './model.entity';
import { TrainingLogEntity } from 'src/modules/training-log/training-log.entity';
import { CreateModelDto } from './create-model.dto';
import { UpdateModelDto } from './update-model.dto';

@ApiBearerAuth('BearerAuth')
@ApiTags('Models')
@Controller('models')
export class ModelController {
  constructor(
    private modelService: ModelService,
    private trainingLogService: TrainingLogService,
  ) {}

  /**
   * Get all trainingLogs by models with pagination support.
   *
   * 
   * @param {number} modelId - The modelId of the trainingLog to retrieve.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering trainingLogs.
   * @returns {Promise<{ result: ModelEntity[]; total: number }>} - The list of models and the total count.
   */
  @Get(':modelId/trainingLog')
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
  async getTrainingLogsByModelId(
    
    @Param('modelId') modelId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: TrainingLogEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.trainingLogService.getTrainingLogsByModelId(
      
      modelId,
      skip,
      itemsPerPage,
      search
    );
  }
  

  /**
   * Get all models with pagination support.
   *
   * 
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering models.
   * @returns {Promise<{ result: ModelEntity[]; total: number }>} - The list of models and the total count.
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
  async getAllModels(
    
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: ModelEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.modelService.getAllModels(
      
      skip,
      itemsPerPage,
      search
    );
  }

  /**
   * Get model data for dropdowns.
   *
   * 
   * @param {string} fields - Comma-separated list of fields to retrieve (optional).
   * @param {string} keyword - The keyword for filtering data (optional).
   * @returns {Promise<ModelEntity[]>} - The list of model data for dropdowns.
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
  async getModelDropdownData(
    
    @Query('fields') fields?: string,
    @Query('keyword') keyword?: string,
  ): Promise<ModelEntity[]> {
    const fieldArray = fields ? fields.split(',') : [
      'id',
      'name',
    ]
    return this.modelService.findAllDropdownData(
      
      fieldArray, 
      keyword
    );
  }

  /**
   * Get a model by ID.
   *
   * 
   * @param {number} id - The id of the model to retrieve.
   * @returns {Promise<ModelEntity>} - The model object.
   */
  @Get(':id')
  async getModelById(
    
    @Param('id') id: number
  ): Promise<ModelEntity> {
    return this.modelService.getModelById(
      
      id
    );
  }

  /**
   * Create a new model.
   *
   * 
   * @param {CreateModelDto} createModelDto - The DTO for creating a model.
   * @returns {Promise<ModelEntity>} - The newly created model object.
   */
  @Post()
  async createModel(
    
    @Body() createModelDto: CreateModelDto
  ): Promise<ModelEntity> {
    return this.modelService.createModel(
      
      createModelDto
    );
  }

  /**
   * Update an existing model.
   *
   * 
   * @param {number} id - The id of the model to update.
   * @param {UpdateModelDto} updateModelDto - The DTO for updating a model.
   * @returns {Promise<ModelEntity>} - The updated model object.
   */
  @Put(':id')
  async updateModel(
    
    @Param('id') id: number,
    @Body() updateModelDto: UpdateModelDto,
  ): Promise<ModelEntity> {
    return this.modelService.updateModel(
      
      id, 
      updateModelDto
    );
  }


  /**
   * Delete a model by ID.
   *
   * 
   * @param {number} id - The id of the model to delete.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteModel(
    
    @Param('id') id: number
  ): Promise<void> {
    return this.modelService.deleteModel(
      
      id
    );
  }
}
