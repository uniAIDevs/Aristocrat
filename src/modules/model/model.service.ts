import { Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { DeepPartial, Like } from 'typeorm';
import { convertArrayToObject } from 'src/shared/utils/common';
import { ModelRepository } from './model.repository';
import { ModelEntity } from './model.entity';
import { CreateModelDto } from './create-model.dto';
import { UpdateModelDto } from './update-model.dto';

@Injectable()
export class ModelService {
  constructor(
    private modelRepository: ModelRepository,
  ) {}

  /**
   * Retrieve a paginated list of models.
   *
   *
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: ModelEntity[]; total: number }>} - The list of models and the total count.
   */
  async getAllModels(
    
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: ModelEntity[]; total: number }> {
    try {
      return await this.modelRepository.getAll( skip, take, search);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Get a model by ID.
   *
   *
   * @param {number} id - The id of the model to retrieve.
   * @returns {Promise<ModelEntity>} - The model object.
   * @throws {NotFoundException} - If the model with the given ID is not found.
   */
  async getModelById(id: number): Promise<ModelEntity> {
    try {
      const model = await this.modelRepository.findById(id);
      if (!model) {
        throw new NotFoundException('ModelEntity not found');
      }
      return model;
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Create a new model.
   *
   *
   * @param {CreateModelDto} createModelDto - The DTO for creating a model.
   * @returns {Promise<ModelEntity>} - The newly created model object.
   */
  async createModel(createModelDto: CreateModelDto): Promise<ModelEntity> {
    try {
      const model = this.modelRepository.create({
        name: createModelDto.name,
                label: createModelDto.label,
                huggingfaceId: createModelDto.huggingfaceId,
                documentation: createModelDto.documentation,
                
      });
      return this.modelRepository.save(model);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Update an existing model.
   *
   *
   * @param {number} id - The id of the model to update.
   * @param {UpdateModelDto} updateModelDto - The DTO for updating a model.
   * @returns {Promise<ModelEntity>} - The updated model object.
   * @throws {NotFoundException} - If the model with the given ID is not found.
   */
  async updateModel(id: number, updateModelDto: UpdateModelDto): Promise<ModelEntity> {
    try {
      const model = await this.getModelById(id);

      const updateData: DeepPartial<ModelEntity> = {
        name: updateModelDto.name,
                label: updateModelDto.label,
                huggingfaceId: updateModelDto.huggingfaceId,
                documentation: updateModelDto.documentation,
                
      };

      this.modelRepository.merge(model, updateData);
      return this.modelRepository.save(model);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Delete a model by its ID.
   *
   *
   * @param {number} id - The id of the model to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} - If the model with the given ID is not found.
   */
  async deleteModel(id: number): Promise<void> {
    try {
      const model = await this.getModelById(id);
      await this.modelRepository.remove(model);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Find model data for dropdowns with optional filtering.
   *
   *
   * @param {string[]} fields - Comma-separated list of fields to retrieve.
   * @param {string} keyword - Optional keyword for filtering data.
   * @returns {Promise<ModelEntity[]>} - The list of model data for dropdowns.
   */
  async findAllDropdownData(fields: string[], keyword?: string): Promise<ModelEntity[]> {
    try {
      return this.modelRepository.findAllDropdown( fields, keyword);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

}
