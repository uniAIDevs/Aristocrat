import { Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { DeepPartial, Like } from 'typeorm';
import { convertArrayToObject } from 'src/shared/utils/common';
import { DatasetRepository } from './dataset.repository';
import { DatasetEntity } from './dataset.entity';
import { CreateDatasetDto } from './create-dataset.dto';
import { UpdateDatasetDto } from './update-dataset.dto';

@Injectable()
export class DatasetService {
  constructor(
    private datasetRepository: DatasetRepository,
  ) {}

  /**
   * Retrieve a paginated list of datasets.
   *
   *
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: DatasetEntity[]; total: number }>} - The list of datasets and the total count.
   */
  async getAllDatasets(
    
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: DatasetEntity[]; total: number }> {
    try {
      return await this.datasetRepository.getAll( skip, take, search);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Get a dataset by ID.
   *
   *
   * @param {number} id - The id of the dataset to retrieve.
   * @returns {Promise<DatasetEntity>} - The dataset object.
   * @throws {NotFoundException} - If the dataset with the given ID is not found.
   */
  async getDatasetById(id: number): Promise<DatasetEntity> {
    try {
      const dataset = await this.datasetRepository.findById(id);
      if (!dataset) {
        throw new NotFoundException('DatasetEntity not found');
      }
      return dataset;
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Create a new dataset.
   *
   *
   * @param {CreateDatasetDto} createDatasetDto - The DTO for creating a dataset.
   * @returns {Promise<DatasetEntity>} - The newly created dataset object.
   */
  async createDataset(createDatasetDto: CreateDatasetDto): Promise<DatasetEntity> {
    try {
      const dataset = this.datasetRepository.create({
        name: createDatasetDto.name,
                source: createDatasetDto.source,
                
      });
      return this.datasetRepository.save(dataset);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Update an existing dataset.
   *
   *
   * @param {number} id - The id of the dataset to update.
   * @param {UpdateDatasetDto} updateDatasetDto - The DTO for updating a dataset.
   * @returns {Promise<DatasetEntity>} - The updated dataset object.
   * @throws {NotFoundException} - If the dataset with the given ID is not found.
   */
  async updateDataset(id: number, updateDatasetDto: UpdateDatasetDto): Promise<DatasetEntity> {
    try {
      const dataset = await this.getDatasetById(id);

      const updateData: DeepPartial<DatasetEntity> = {
        name: updateDatasetDto.name,
                source: updateDatasetDto.source,
                
      };

      this.datasetRepository.merge(dataset, updateData);
      return this.datasetRepository.save(dataset);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Delete a dataset by its ID.
   *
   *
   * @param {number} id - The id of the dataset to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} - If the dataset with the given ID is not found.
   */
  async deleteDataset(id: number): Promise<void> {
    try {
      const dataset = await this.getDatasetById(id);
      await this.datasetRepository.remove(dataset);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Find dataset data for dropdowns with optional filtering.
   *
   *
   * @param {string[]} fields - Comma-separated list of fields to retrieve.
   * @param {string} keyword - Optional keyword for filtering data.
   * @returns {Promise<DatasetEntity[]>} - The list of dataset data for dropdowns.
   */
  async findAllDropdownData(fields: string[], keyword?: string): Promise<DatasetEntity[]> {
    try {
      return this.datasetRepository.findAllDropdown( fields, keyword);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

}
