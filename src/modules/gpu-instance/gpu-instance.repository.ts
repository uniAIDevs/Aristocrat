import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { GpuInstanceEntity } from './gpu-instance.entity';

@Injectable()
export class GpuInstanceRepository extends Repository<GpuInstanceEntity> {
  
  constructor(private dataSource: DataSource) {
    super(GpuInstanceEntity, dataSource.createEntityManager());
  }

  /**
   * Find a gpuInstance by its ID for a specific user.
   *
   * @param {number} userId - The ID of the user whose gpuInstance to retrieve.
   * @param {number} id - The id of the gpuInstance to retrieve.
   * @returns {Promise<GpuInstanceEntity>} - The gpuInstance object.
   */
  async findById(userId: number,id: number): Promise<GpuInstanceEntity> {
    return await this.findOne({
      where: { id, user: { id: userId }  },
      relations: [
      ]
    });
  }

  /**
   * Retrieve gpuInstances based on search criteria, pagination, and user ID
   *
   * @param {number} userId - The ID of the user whose gpuInstance to retrieve.
   * @param {number} skip - The number of records to skip for pagination.
   * @param {number} take - The number of records to retrieve for pagination.
   * @param {string} searchTerm - Optional search term for filtering gpuInstances.
   * @returns {Promise<{ result: GpuInstanceEntity[]; total: number }>} - The gpuInstances and total count.
   */
  async getAll(
    userId: number,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: GpuInstanceEntity[]; total: number }> {
    // Create a query builder to construct the SQL query for retrieving gpuInstances
    const queryBuilder = this.getQueryBuilder(
      userId,
      [
        'name',
                'status',
              ],
      searchTerm, // Optional search term for filtering gpuInstances
    );


    // Order gpuInstances by createdAt timestamp in descending order
    queryBuilder.orderBy('gpuInstance.createdAt', 'DESC').addSelect('gpuInstance.createdAt');

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
   * Retrieve gpuInstances based on search criteria and user ID for dropdown selection.
   *
   * @param {number} userId - The ID of the user whose gpuInstance to retrieve.
   * @param {string[]} fields - The fields to select in the query.
   * @param {string} keyword - Optional keyword for filtering gpuInstances.
   * @returns {Promise<GpuInstanceEntity[]>} - The gpuInstances.
   */
  async findAllDropdown(
    userId: number,
    fields: string[],
    keyword?: string,
  ): Promise<GpuInstanceEntity[]> {
    // Create a query builder to construct the SQL query for retrieving gpuInstances
    const queryBuilder = this.getQueryBuilder(userId, fields, keyword);

    const selectedColumns = fields.map((field) => `gpuInstance.${field}`);

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
   * @param {string} keyword - Optional keyword for filtering gpuInstances.
   * @returns {SelectQueryBuilder<GpuInstanceEntity>} - The constructed query builder.
   */
  getQueryBuilder(
    userId: number,
    fields: string[],
    keyword?: string,
  ): SelectQueryBuilder<GpuInstanceEntity> {
    // Create a query builder for the 'gpuInstance' entity
    const queryBuilder = this.createQueryBuilder('gpuInstance');

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (keyword) {
      fields.forEach((field, index) => {
        if (index === 0) {
          queryBuilder.where(`gpuInstance.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        } else {
          queryBuilder.orWhere(`gpuInstance.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        }
      });
    }

    // Add a condition to filter gpuInstances based on user ID
    queryBuilder.andWhere('gpuInstance.user.id = :userId', { userId });

    // Return the constructed query builder
    return queryBuilder;
  }

}
