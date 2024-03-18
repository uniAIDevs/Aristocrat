import { Controller, Get, Post, Put, Delete, Param, Body, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { PromptService } from './prompt.service';
import { TrainingLogService } from 'src/modules/training-log/training-log.service';
import { PromptEntity } from './prompt.entity';
import { TrainingLogEntity } from 'src/modules/training-log/training-log.entity';
import { CreatePromptDto } from './create-prompt.dto';
import { UpdatePromptDto } from './update-prompt.dto';

@ApiBearerAuth('BearerAuth')
@ApiTags('Prompts')
@Controller('prompts')
export class PromptController {
  constructor(
    private promptService: PromptService,
    private trainingLogService: TrainingLogService,
  ) {}

  /**
   * Get all trainingLogs by prompts with pagination support.
   *
   * 
   * @param {number} promptId - The promptId of the trainingLog to retrieve.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering trainingLogs.
   * @returns {Promise<{ result: PromptEntity[]; total: number }>} - The list of prompts and the total count.
   */
  @Get(':promptId/trainingLog')
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
  async getTrainingLogsByPromptId(
    
    @Param('promptId') promptId: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: TrainingLogEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.trainingLogService.getTrainingLogsByPromptId(
      
      promptId,
      skip,
      itemsPerPage,
      search
    );
  }
  

  /**
   * Get all prompts with pagination support.
   *
   * @param {Request} req - The Express request object.
   * @param {number} page - The page number for pagination (optional, default: 1).
   * @param {number} limit - The number of items per page (optional, default: 10).
   * @param {string} search - Optional search term for filtering prompts.
   * @returns {Promise<{ result: PromptEntity[]; total: number }>} - The list of prompts and the total count.
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
  async getAllPrompts(
    @Req() req,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('search') search?: string,
  ): Promise<{ result: PromptEntity[]; total: number }> {
    // Convert page and limit to numbers and ensure they are positive values
    const pageNumber = Math.max(1, Number(page));
    const itemsPerPage = Math.max(1, Number(limit));

    // Calculate the number of items to skip based on the current page and items per page
    const skip = (pageNumber - 1) * itemsPerPage;

    return this.promptService.getAllPrompts(
      req.user.userId,
      skip,
      itemsPerPage,
      search
    );
  }

  /**
   * Get prompt data for dropdowns.
   *
   * @param {Request} req - The Express request object.
   * @param {string} fields - Comma-separated list of fields to retrieve (optional).
   * @param {string} keyword - The keyword for filtering data (optional).
   * @returns {Promise<PromptEntity[]>} - The list of prompt data for dropdowns.
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
  async getPromptDropdownData(
    @Req() req,
    @Query('fields') fields?: string,
    @Query('keyword') keyword?: string,
  ): Promise<PromptEntity[]> {
    const fieldArray = fields ? fields.split(',') : [
      'id',
      'promptText',
    ]
    return this.promptService.findAllDropdownData(
      req.user.userId,
      fieldArray, 
      keyword
    );
  }

  /**
   * Get a prompt by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the prompt to retrieve.
   * @returns {Promise<PromptEntity>} - The prompt object.
   */
  @Get(':id')
  async getPromptById(
    @Req() req,
    @Param('id') id: number
  ): Promise<PromptEntity> {
    return this.promptService.getPromptById(
      req.user.userId,
      id
    );
  }

  /**
   * Create a new prompt.
   *
   * @param {Request} req - The Express request object.
   * @param {CreatePromptDto} createPromptDto - The DTO for creating a prompt.
   * @returns {Promise<PromptEntity>} - The newly created prompt object.
   */
  @Post()
  async createPrompt(
    @Req() req,
    @Body() createPromptDto: CreatePromptDto
  ): Promise<PromptEntity> {
    return this.promptService.createPrompt(
      req.user.userId,
      createPromptDto
    );
  }

  /**
   * Update an existing prompt.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the prompt to update.
   * @param {UpdatePromptDto} updatePromptDto - The DTO for updating a prompt.
   * @returns {Promise<PromptEntity>} - The updated prompt object.
   */
  @Put(':id')
  async updatePrompt(
    @Req() req,
    @Param('id') id: number,
    @Body() updatePromptDto: UpdatePromptDto,
  ): Promise<PromptEntity> {
    return this.promptService.updatePrompt(
      req.user.userId,
      id, 
      updatePromptDto
    );
  }


  /**
   * Delete a prompt by ID.
   *
   * @param {Request} req - The Express request object.
   * @param {number} id - The id of the prompt to delete.
   * @returns {Promise<void>}
   */
  @Delete(':id')
  async deletePrompt(
    @Req() req,
    @Param('id') id: number
  ): Promise<void> {
    return this.promptService.deletePrompt(
      req.user.userId,
      id
    );
  }
}
