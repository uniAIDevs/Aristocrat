import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ModelEntity } from './model.entity';

@Injectable()
export class ModelRepository extends Repository<ModelEntity> {
  
  constructor(private dataSource: DataSource) {
    super(ModelEntity, dataSource.createEntityManager());
  }

  /**
   * Find a model by its ID 
   *
   * 
   * @param {number} id - The id of the model to retrieve.
   * @returns {Promise<ModelEntity>} - The model object.
   */
  async findById(id: number): Promise<ModelEntity> {
    return await this.findOne({
      where: { id,  },
      relations: [
      ]
    });
  }

  /**
   * Retrieve models based on search criteria, pagination, 
   *
   * 
   * @param {number} skip - The number of records to skip for pagination.
   * @param {number} take - The number of records to retrieve for pagination.
   * @param {string} searchTerm - Optional search term for filtering models.
   * @returns {Promise<{ result: ModelEntity[]; total: number }>} - The models and total count.
   */
  async getAll(
    
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: ModelEntity[]; total: number }> {
    // Create a query builder to construct the SQL query for retrieving models
    const queryBuilder = this.getQueryBuilder(
      
      [
        'name',
                'label',
                'huggingfaceId',
                'documentation',
              ],
      searchTerm, // Optional search term for filtering models
    );


    // Order models by createdAt timestamp in descending order
    queryBuilder.orderBy('model.createdAt', 'DESC').addSelect('model.createdAt');

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
   * Retrieve models based on search criteria and user ID for dropdown selection.
   *
   * 
   * @param {string[]} fields - The fields to select in the query.
   * @param {string} keyword - Optional keyword for filtering models.
   * @returns {Promise<ModelEntity[]>} - The models.
   */
  async findAllDropdown(
    
    fields: string[],
    keyword?: string,
  ): Promise<ModelEntity[]> {
    // Create a query builder to construct the SQL query for retrieving models
    const queryBuilder = this.getQueryBuilder( fields, keyword);

    const selectedColumns = fields.map((field) => `model.${field}`);

    // Set the select and take properties
    queryBuilder.select(selectedColumns).take(5);

    // Execute the query and return the result
    return await queryBuilder.getMany();
  }

  /**
   * Helper function to create a query builder based on fields, optional keyword 
   *
   * 
   * @param {string[]} fields - The fields to include in the search.
   * @param {string} keyword - Optional keyword for filtering models.
   * @returns {SelectQueryBuilder<ModelEntity>} - The constructed query builder.
   */
  getQueryBuilder(
    
    fields: string[],
    keyword?: string,
  ): SelectQueryBuilder<ModelEntity> {
    // Create a query builder for the 'model' entity
    const queryBuilder = this.createQueryBuilder('model');

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (keyword) {
      fields.forEach((field, index) => {
        if (index === 0) {
          queryBuilder.where(`model.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        } else {
          queryBuilder.orWhere(`model.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        }
      });
    }


    // Return the constructed query builder
    return queryBuilder;
  }

}
