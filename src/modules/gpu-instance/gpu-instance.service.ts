import { Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { DeepPartial, Like } from 'typeorm';
import { convertArrayToObject } from 'src/shared/utils/common';
import { GpuInstanceRepository } from './gpu-instance.repository';
import { GpuInstanceEntity } from './gpu-instance.entity';
import { CreateGpuInstanceDto } from './create-gpu-instance.dto';
import { UpdateGpuInstanceDto } from './update-gpu-instance.dto';

@Injectable()
export class GpuInstanceService {
  constructor(
    private gpuInstanceRepository: GpuInstanceRepository,
  ) {}

  /**
   * Retrieve a paginated list of gpuInstances for a specific user.
   *
   * @param {number} userId - The ID of the user whose gpuInstances to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: GpuInstanceEntity[]; total: number }>} - The list of gpuInstances and the total count.
   */
  async getAllGpuInstances(
    userId: number,
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: GpuInstanceEntity[]; total: number }> {
    try {
      return await this.gpuInstanceRepository.getAll(userId, skip, take, search);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Get a gpuInstance by ID for a specific user.
   *
   * @param {number} userId - The ID of the user who owns the gpuInstance.
   * @param {number} id - The id of the gpuInstance to retrieve.
   * @returns {Promise<GpuInstanceEntity>} - The gpuInstance object.
   * @throws {NotFoundException} - If the gpuInstance with the given ID is not found.
   */
  async getGpuInstanceById(userId: number,id: number): Promise<GpuInstanceEntity> {
    try {
      const gpuInstance = await this.gpuInstanceRepository.findById(userId,id);
      if (!gpuInstance) {
        throw new NotFoundException('GpuInstanceEntity not found');
      }
      return gpuInstance;
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Create a new gpuInstance for a specific user.
   *
   * @param {number} userId - The ID of the user creating the gpuInstance.
   * @param {CreateGpuInstanceDto} createGpuInstanceDto - The DTO for creating a gpuInstance.
   * @returns {Promise<GpuInstanceEntity>} - The newly created gpuInstance object.
   */
  async createGpuInstance(userId: number,createGpuInstanceDto: CreateGpuInstanceDto): Promise<GpuInstanceEntity> {
    try {
      const gpuInstance = this.gpuInstanceRepository.create({
        name: createGpuInstanceDto.name,
                status: createGpuInstanceDto.status,
                user: { id: userId }, 
      });
      return this.gpuInstanceRepository.save(gpuInstance);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Update an existing gpuInstance for a specific user.
   *
   * @param {number} userId - The ID of the user who owns the gpuInstance.
   * @param {number} id - The id of the gpuInstance to update.
   * @param {UpdateGpuInstanceDto} updateGpuInstanceDto - The DTO for updating a gpuInstance.
   * @returns {Promise<GpuInstanceEntity>} - The updated gpuInstance object.
   * @throws {NotFoundException} - If the gpuInstance with the given ID is not found.
   */
  async updateGpuInstance(userId: number,id: number, updateGpuInstanceDto: UpdateGpuInstanceDto): Promise<GpuInstanceEntity> {
    try {
      const gpuInstance = await this.getGpuInstanceById(userId, id);

      const updateData: DeepPartial<GpuInstanceEntity> = {
        name: updateGpuInstanceDto.name,
                status: updateGpuInstanceDto.status,
                user: { id: userId }, 
      };

      this.gpuInstanceRepository.merge(gpuInstance, updateData);
      return this.gpuInstanceRepository.save(gpuInstance);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Delete a gpuInstance for a specific user by its ID.
   *
   * @param {number} userId - The ID of the user who owns the gpuInstance.
   * @param {number} id - The id of the gpuInstance to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} - If the gpuInstance with the given ID is not found.
   */
  async deleteGpuInstance(userId: number,id: number): Promise<void> {
    try {
      const gpuInstance = await this.getGpuInstanceById(userId,id);
      await this.gpuInstanceRepository.remove(gpuInstance);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Find gpuInstance data for dropdowns with optional filtering.
   *
   *@param {number} userId - The ID of the user whose data to retrieve.
   * @param {string[]} fields - Comma-separated list of fields to retrieve.
   * @param {string} keyword - Optional keyword for filtering data.
   * @returns {Promise<GpuInstanceEntity[]>} - The list of gpuInstance data for dropdowns.
   */
  async findAllDropdownData(userId: number,fields: string[], keyword?: string): Promise<GpuInstanceEntity[]> {
    try {
      return this.gpuInstanceRepository.findAllDropdown(userId, fields, keyword);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

}
