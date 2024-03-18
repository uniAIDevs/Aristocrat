import { Injectable, NotFoundException, BadRequestException, } from '@nestjs/common';
import { DeepPartial, Like } from 'typeorm';
import { convertArrayToObject } from 'src/shared/utils/common';
import { PromptRepository } from './prompt.repository';
import { PromptEntity } from './prompt.entity';
import { CreatePromptDto } from './create-prompt.dto';
import { UpdatePromptDto } from './update-prompt.dto';

@Injectable()
export class PromptService {
  constructor(
    private promptRepository: PromptRepository,
  ) {}

  /**
   * Retrieve a paginated list of prompts for a specific user.
   *
   * @param {number} userId - The ID of the user whose prompts to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} search - Optional search term for filter.
   * @returns {Promise<{ result: PromptEntity[]; total: number }>} - The list of prompts and the total count.
   */
  async getAllPrompts(
    userId: number,
    skip: number,
    take: number,
    search?: string,
  ): Promise<{ result: PromptEntity[]; total: number }> {
    try {
      return await this.promptRepository.getAll(userId, skip, take, search);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Get a prompt by ID for a specific user.
   *
   * @param {number} userId - The ID of the user who owns the prompt.
   * @param {number} id - The id of the prompt to retrieve.
   * @returns {Promise<PromptEntity>} - The prompt object.
   * @throws {NotFoundException} - If the prompt with the given ID is not found.
   */
  async getPromptById(userId: number,id: number): Promise<PromptEntity> {
    try {
      const prompt = await this.promptRepository.findById(userId,id);
      if (!prompt) {
        throw new NotFoundException('PromptEntity not found');
      }
      return prompt;
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Create a new prompt for a specific user.
   *
   * @param {number} userId - The ID of the user creating the prompt.
   * @param {CreatePromptDto} createPromptDto - The DTO for creating a prompt.
   * @returns {Promise<PromptEntity>} - The newly created prompt object.
   */
  async createPrompt(userId: number,createPromptDto: CreatePromptDto): Promise<PromptEntity> {
    try {
      const prompt = this.promptRepository.create({
        promptText: createPromptDto.promptText,
                user: { id: userId }, 
      });
      return this.promptRepository.save(prompt);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Update an existing prompt for a specific user.
   *
   * @param {number} userId - The ID of the user who owns the prompt.
   * @param {number} id - The id of the prompt to update.
   * @param {UpdatePromptDto} updatePromptDto - The DTO for updating a prompt.
   * @returns {Promise<PromptEntity>} - The updated prompt object.
   * @throws {NotFoundException} - If the prompt with the given ID is not found.
   */
  async updatePrompt(userId: number,id: number, updatePromptDto: UpdatePromptDto): Promise<PromptEntity> {
    try {
      const prompt = await this.getPromptById(userId, id);

      const updateData: DeepPartial<PromptEntity> = {
        promptText: updatePromptDto.promptText,
                user: { id: userId }, 
      };

      this.promptRepository.merge(prompt, updateData);
      return this.promptRepository.save(prompt);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Delete a prompt for a specific user by its ID.
   *
   * @param {number} userId - The ID of the user who owns the prompt.
   * @param {number} id - The id of the prompt to delete.
   * @returns {Promise<void>}
   * @throws {NotFoundException} - If the prompt with the given ID is not found.
   */
  async deletePrompt(userId: number,id: number): Promise<void> {
    try {
      const prompt = await this.getPromptById(userId,id);
      await this.promptRepository.remove(prompt);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

  /**
   * Find prompt data for dropdowns with optional filtering.
   *
   *@param {number} userId - The ID of the user whose data to retrieve.
   * @param {string[]} fields - Comma-separated list of fields to retrieve.
   * @param {string} keyword - Optional keyword for filtering data.
   * @returns {Promise<PromptEntity[]>} - The list of prompt data for dropdowns.
   */
  async findAllDropdownData(userId: number,fields: string[], keyword?: string): Promise<PromptEntity[]> {
    try {
      return this.promptRepository.findAllDropdown(userId, fields, keyword);
    } catch (e) {
      throw new BadRequestException(e.message, e.code);
    }
  }

}
