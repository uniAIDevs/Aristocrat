import { Controller, Get, Post, Put, Delete, Param, Body, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { DatasetService } from './dataset.service';
import { TrainingLogService } from 'src/modules/training-log/training-log.service';
import { DatasetEntity } from './dataset.entity';
import { TrainingLogEntity } from 'src/modules/training-log/training-log.entity';
import { CreateDatasetDto } from './create-dataset.dto';
import { UpdateDatasetDto } from './update-dataset.dto';

@ApiBearerAuth('BearerAuth')
@ApiTags('Datasets')
@Controller('datasets')
export class DatasetController {
  constructor(
    private datasetService: DatasetService,
    private trainingLogService: TrainingLogService,
  ) {}

  /**
   * Get all trainingLogs by datasets with pagination support.
   *
   * 
   * @param {number} datasetId - The datasetId of the trainingLog to retrieve.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering trainingLogs.
   * @returns {Promise<{ result: DatasetEntity[]; total: number }>} - The list of datasets and the total count.
   */
  @Get(':datasetId/trainingLog')
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
  async getTrainingLogsByDatasetId(
    
    @Param('datasetId') datasetId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: TrainingLogEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.trainingLogService.getTrainingLogsByDatasetId(
      
      datasetId,
      skip,
      itemsPerPage,
      search
    );
  }
  

  /**
   * Get all datasets with pagination support.
   *
   * 
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering datasets.
   * @returns {Promise<{ result: DatasetEntity[]; total: number }>} - The list of datasets and the total count.
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
  async getAllDatasets(
    
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: DatasetEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.datasetService.getAllDatasets(
      
      skip,
      itemsPerPage,
      search
    );
  }

  /**
   * Get dataset data for dropdowns.
   *
   * 
   * @param {string} fields - Comma-separated list of fields to retrieve (optional).
   * @param {string} keyword - The keyword for filtering data (optional).
   * @returns {Promise<DatasetEntity[]>} - The list of dataset data for dropdowns.
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
  async getDatasetDropdownData(
    
    @Query('fields') fields?: string,
    @Query('keyword') keyword?: string,
  ): Promise<DatasetEntity[]> {
    const fieldArray = fields ? fields.split(',') : [
      'id',
      'name',
    ]
    return this.datasetService.findAllDropdownData(
      
      fieldArray, 
      keyword
    );
  }

  /**
   * Get a dataset by ID.
   *
   * 
   * @param {number} id - The id of the dataset to retrieve.
   * @returns {Promise<DatasetEntity>} - The dataset object.
   */
  @Get(':id')
  async getDatasetById(
    
    @Param('id') id: number
  ): Promise<DatasetEntity> {
    return this.datasetService.getDatasetById(
      
      id
    );
  }

  /**
   * Create a new dataset.
   *
   * 
   * @param {CreateDatasetDto} createDatasetDto - The DTO for creating a dataset.
   * @returns {Promise<DatasetEntity>} - The newly created dataset object.
   */
  @Post()
  async createDataset(
    
    @Body() createDatasetDto: CreateDatasetDto
  ): Promise<DatasetEntity> {
    return this.datasetService.createDataset(
      
      createDatasetDto
    );
  }

  /**
   * Update an existing dataset.
   *
   * 
   * @param {number} id - The id of the dataset to update.
   * @param {UpdateDatasetDto} updateDatasetDto - The DTO for updating a dataset.
   * @returns {Promise<DatasetEntity>} - The updated dataset object.
   */
  @Put(':id')
  async updateDataset(
    
    @Param('id') id: number,
    @Body() updateDatasetDto: UpdateDatasetDto,
  ): Promise<DatasetEntity> {
    return this.datasetService.updateDataset(
      
      id, 
      updateDatasetDto
    );
  }


  /**
   * Delete a dataset by ID.
   *
   * 
   * @param {number} id - The id of the dataset to delete.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deleteDataset(
    
    @Param('id') id: number
  ): Promise<void> {
    return this.datasetService.deleteDataset(
      
      id
    );
  }
}
