import { Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { DeepPartial, Like } from 'typeorm';
import { convertArrayToObject } from 'src/shared/utils/common';
import { TrainingLogRepository } from './training-log.repository';
import { TrainingLogEntity } from './training-log.entity';
import { CreateTrainingLogDto } from './create-training-log.dto';
import { UpdateTrainingLogDto } from './update-training-log.dto';

@Injectable()
export class TrainingLogService {
  constructor(
    private trainingLogRepository: TrainingLogRepository,
  ) {}

  /**
   * Retrieve a paginated list of trainingLogs.
   *
   *
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: TrainingLogEntity[]; total: number }>} - The list of trainingLogs and the total count.
   */
  async getAllTrainingLogs(
    
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: TrainingLogEntity[]; total: number }> {
    try {
      return await this.trainingLogRepository.getAll( skip, take, search);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Get a trainingLog by ID.
   *
   *
   * @param {number} id - The id of the trainingLog to retrieve.
   * @returns {Promise<TrainingLogEntity>} - The trainingLog object.
   * @throws {NotFoundException} - If the trainingLog with the given ID is not found.
   */
  async getTrainingLogById(id: number): Promise<TrainingLogEntity> {
    try {
      const trainingLog = await this.trainingLogRepository.findById(id);
      if (!trainingLog) {
        throw new NotFoundException('TrainingLogEntity not found');
      }
      return trainingLog;
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Create a new trainingLog.
   *
   *
   * @param {CreateTrainingLogDto} createTrainingLogDto - The DTO for creating a trainingLog.
   * @returns {Promise<TrainingLogEntity>} - The newly created trainingLog object.
   */
  async createTrainingLog(createTrainingLogDto: CreateTrainingLogDto): Promise<TrainingLogEntity> {
    try {
      const trainingLog = this.trainingLogRepository.create({
        status: createTrainingLogDto.status,
                model: { id: createTrainingLogDto.modelId },
        prompt: { id: createTrainingLogDto.promptId },
        dataset: { id: createTrainingLogDto.datasetId },
        gpuInstance: { id: createTrainingLogDto.gpuInstanceId },
        
      });
      return this.trainingLogRepository.save(trainingLog);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Update an existing trainingLog.
   *
   *
   * @param {number} id - The id of the trainingLog to update.
   * @param {UpdateTrainingLogDto} updateTrainingLogDto - The DTO for updating a trainingLog.
   * @returns {Promise<TrainingLogEntity>} - The updated trainingLog object.
   * @throws {NotFoundException} - If the trainingLog with the given ID is not found.
   */
  async updateTrainingLog(id: number, updateTrainingLogDto: UpdateTrainingLogDto): Promise<TrainingLogEntity> {
    try {
      const trainingLog = await this.getTrainingLogById(id);

      const updateData: DeepPartial<TrainingLogEntity> = {
        status: updateTrainingLogDto.status,
                model: { id: updateTrainingLogDto.modelId },
        prompt: { id: updateTrainingLogDto.promptId },
        dataset: { id: updateTrainingLogDto.datasetId },
        gpuInstance: { id: updateTrainingLogDto.gpuInstanceId },
        
      };

      this.trainingLogRepository.merge(trainingLog, updateData);
      return this.trainingLogRepository.save(trainingLog);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Delete a trainingLog by its ID.
   *
   *
   * @param {number} id - The id of the trainingLog to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} - If the trainingLog with the given ID is not found.
   */
  async deleteTrainingLog(id: number): Promise<void> {
    try {
      const trainingLog = await this.getTrainingLogById(id);
      await this.trainingLogRepository.remove(trainingLog);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Find trainingLog data for dropdowns with optional filtering.
   *
   *
   * @param {string[]} fields - Comma-separated list of fields to retrieve.
   * @param {string} keyword - Optional keyword for filtering data.
   * @returns {Promise<TrainingLogEntity[]>} - The list of trainingLog data for dropdowns.
   */
  async findAllDropdownData(fields: string[], keyword?: string): Promise<TrainingLogEntity[]> {
    try {
      return this.trainingLogRepository.findAllDropdown( fields, keyword);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

   /**
   * Retrieve a paginated list of trainingLogs by model.
   *
   *
   * @param {number} modelId - The modelId of the trainingLog to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: TrainingLogEntity[]; total: number }>} - The list of trainingLogs and the total count.
   */
  async getTrainingLogsByModelId(
    
    modelId: number,
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: TrainingLogEntity[]; total: number }> {
    try {
      return await this.trainingLogRepository.getTrainingLogsByModelId( modelId, skip, take, search);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

   /**
   * Retrieve a paginated list of trainingLogs by prompt.
   *
   *
   * @param {number} promptId - The promptId of the trainingLog to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: TrainingLogEntity[]; total: number }>} - The list of trainingLogs and the total count.
   */
  async getTrainingLogsByPromptId(
    
    promptId: number,
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: TrainingLogEntity[]; total: number }> {
    try {
      return await this.trainingLogRepository.getTrainingLogsByPromptId( promptId, skip, take, search);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

   /**
   * Retrieve a paginated list of trainingLogs by dataset.
   *
   *
   * @param {number} datasetId - The datasetId of the trainingLog to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: TrainingLogEntity[]; total: number }>} - The list of trainingLogs and the total count.
   */
  async getTrainingLogsByDatasetId(
    
    datasetId: number,
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: TrainingLogEntity[]; total: number }> {
    try {
      return await this.trainingLogRepository.getTrainingLogsByDatasetId( datasetId, skip, take, search);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

   /**
   * Retrieve a paginated list of trainingLogs by gpuInstance.
   *
   *
   * @param {number} gpuInstanceId - The gpuInstanceId of the trainingLog to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: TrainingLogEntity[]; total: number }>} - The list of trainingLogs and the total count.
   */
  async getTrainingLogsByGpuInstanceId(
    
    gpuInstanceId: number,
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: TrainingLogEntity[]; total: number }> {
    try {
      return await this.trainingLogRepository.getTrainingLogsByGpuInstanceId( gpuInstanceId, skip, take, search);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

}
