import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { PromptEntity } from './prompt.entity';

@Injectable()
export class PromptRepository extends Repository<PromptEntity> {
  
  constructor(private dataSource: DataSource) {
    super(PromptEntity, dataSource.createEntityManager());
  }

  /**
   * Find a prompt by its ID for a specific user.
   *
   * @param {number} userId - The ID of the user whose prompt to retrieve.
   * @param {number} id - The id of the prompt to retrieve.
   * @returns {Promise<PromptEntity>} - The prompt object.
   */
  async findById(userId: number,id: number): Promise<PromptEntity> {
    return await this.findOne({
      where: { id, user: { id: userId }  },
      relations: [
      ]
    });
  }

  /**
   * Retrieve prompts based on search criteria, pagination, and user ID
   *
   * @param {number} userId - The ID of the user whose prompt to retrieve.
   * @param {number} skip - The number of records to skip for pagination.
   * @param {number} take - The number of records to retrieve for pagination.
   * @param {string} searchTerm - Optional search term for filtering prompts.
   * @returns {Promise<{ result: PromptEntity[]; total: number }>} - The prompts and total count.
   */
  async getAll(
    userId: number,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: PromptEntity[]; total: number }> {
    // Create a query builder to construct the SQL query for retrieving prompts
    const queryBuilder = this.getQueryBuilder(
      userId,
      [
        'promptText',
              ],
      searchTerm, // Optional search term for filtering prompts
    );


    // Order prompts by createdAt timestamp in descending order
    queryBuilder.orderBy('prompt.createdAt', 'DESC').addSelect('prompt.createdAt');

    // Set the select, skip, and take properties for pagination
    queryBuilder.select().take(take).skip(skip);

    // Execute the query and return the result along with the total count
    const [result, total] = await queryBuilder.getManyAndCount();

    return {
      result,
      total,
    };
  }

  /**
   * Retrieve prompts based on search criteria and user ID for dropdown selection.
   *
   * @param {number} userId - The ID of the user whose prompt to retrieve.
   * @param {string[]} fields - The fields to select in the query.
   * @param {string} keyword - Optional keyword for filtering prompts.
   * @returns {Promise<PromptEntity[]>} - The prompts.
   */
  async findAllDropdown(
    userId: number,
    fields: string[],
    keyword?: string,
  ): Promise<PromptEntity[]> {
    // Create a query builder to construct the SQL query for retrieving prompts
    const queryBuilder = this.getQueryBuilder(userId, fields, keyword);

    const selectedColumns = fields.map((field) => `prompt.${field}`);

    // Set the select and take properties
    queryBuilder.select(selectedColumns).take(5);

    // Execute the query and return the result
    return await queryBuilder.getMany();
  }

  /**
   * Helper function to create a query builder based on fields, optional keyword  and user Id
   *
   * @param {number} userId - The ID of the user for the query.
   * @param {string[]} fields - The fields to include in the search.
   * @param {string} keyword - Optional keyword for filtering prompts.
   * @returns {SelectQueryBuilder<PromptEntity>} - The constructed query builder.
   */
  getQueryBuilder(
    userId: number,
    fields: string[],
    keyword?: string,
  ): SelectQueryBuilder<PromptEntity> {
    // Create a query builder for the 'prompt' entity
    const queryBuilder = this.createQueryBuilder('prompt');

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (keyword) {
      fields.forEach((field, index) => {
        if (index === 0) {
          queryBuilder.where(`prompt.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        } else {
          queryBuilder.orWhere(`prompt.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        }
      });
    }

    // Add a condition to filter prompts based on user ID
    queryBuilder.andWhere('prompt.user.id = :userId', { userId });

    // Return the constructed query builder
    return queryBuilder;
  }

}
