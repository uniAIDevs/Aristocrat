import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { DatasetEntity } from './dataset.entity';

@Injectable()
export class DatasetRepository extends Repository<DatasetEntity> {
  
  constructor(private dataSource: DataSource) {
    super(DatasetEntity, dataSource.createEntityManager());
  }

  /**
   * Find a dataset by its ID 
   *
   * 
   * @param {number} id - The id of the dataset to retrieve.
   * @returns {Promise<DatasetEntity>} - The dataset object.
   */
  async findById(id: number): Promise<DatasetEntity> {
    return await this.findOne({
      where: { id,  },
      relations: [
      ]
    });
  }

  /**
   * Retrieve datasets based on search criteria, pagination, 
   *
   * 
   * @param {number} skip - The number of records to skip for pagination.
   * @param {number} take - The number of records to retrieve for pagination.
   * @param {string} searchTerm - Optional search term for filtering datasets.
   * @returns {Promise<{ result: DatasetEntity[]; total: number }>} - The datasets and total count.
   */
  async getAll(
    
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: DatasetEntity[]; total: number }> {
    // Create a query builder to construct the SQL query for retrieving datasets
    const queryBuilder = this.getQueryBuilder(
      
      [
        'name',
                'source',
              ],
      searchTerm, // Optional search term for filtering datasets
    );


    // Order datasets by createdAt timestamp in descending order
    queryBuilder.orderBy('dataset.createdAt', 'DESC').addSelect('dataset.createdAt');

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
   * Retrieve datasets based on search criteria and user ID for dropdown selection.
   *
   * 
   * @param {string[]} fields - The fields to select in the query.
   * @param {string} keyword - Optional keyword for filtering datasets.
   * @returns {Promise<DatasetEntity[]>} - The datasets.
   */
  async findAllDropdown(
    
    fields: string[],
    keyword?: string,
  ): Promise<DatasetEntity[]> {
    // Create a query builder to construct the SQL query for retrieving datasets
    const queryBuilder = this.getQueryBuilder( fields, keyword);

    const selectedColumns = fields.map((field) => `dataset.${field}`);

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
   * @param {string} keyword - Optional keyword for filtering datasets.
   * @returns {SelectQueryBuilder<DatasetEntity>} - The constructed query builder.
   */
  getQueryBuilder(
    
    fields: string[],
    keyword?: string,
  ): SelectQueryBuilder<DatasetEntity> {
    // Create a query builder for the 'dataset' entity
    const queryBuilder = this.createQueryBuilder('dataset');

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (keyword) {
      fields.forEach((field, index) => {
        if (index === 0) {
          queryBuilder.where(`dataset.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        } else {
          queryBuilder.orWhere(`dataset.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        }
      });
    }


    // Return the constructed query builder
    return queryBuilder;
  }

}
