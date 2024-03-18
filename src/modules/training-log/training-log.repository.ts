import { Brackets, DataSource, Repository, SelectQueryBuilder } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { TrainingLogEntity } from './training-log.entity';

@Injectable()
export class TrainingLogRepository extends Repository<TrainingLogEntity> {
  
  constructor(private dataSource: DataSource) {
    super(TrainingLogEntity, dataSource.createEntityManager());
  }

  /**
   * Find a trainingLog by its ID 
   *
   * 
   * @param {number} id - The id of the trainingLog to retrieve.
   * @returns {Promise<TrainingLogEntity>} - The trainingLog object.
   */
  async findById(id: number): Promise<TrainingLogEntity> {
    return await this.findOne({
      where: { id,  },
      relations: [
        'model',
        'prompt',
        'dataset',
        'gpuInstance',
      ]
    });
  }

  /**
   * Retrieve trainingLogs based on search criteria, pagination, 
   *
   * 
   * @param {number} skip - The number of records to skip for pagination.
   * @param {number} take - The number of records to retrieve for pagination.
   * @param {string} searchTerm - Optional search term for filtering trainingLogs.
   * @returns {Promise<{ result: TrainingLogEntity[]; total: number }>} - The trainingLogs and total count.
   */
  async getAll(
    
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: TrainingLogEntity[]; total: number }> {
    // Create a query builder to construct the SQL query for retrieving trainingLogs
    const queryBuilder = this.getQueryBuilder(
      
      [
        'status',
              ],
      searchTerm, // Optional search term for filtering trainingLogs
    );

    queryBuilder
    .innerJoin('trainingLog.model', 'model')
    .addSelect(['model.id', 'model.name']);

    if(searchTerm) {
      queryBuilder.orWhere(`model.name LIKE :keyword`, {
        keyword: `${searchTerm}%`,
      });
    }
    
    queryBuilder
    .innerJoin('trainingLog.prompt', 'prompt')
    .addSelect(['prompt.id', 'prompt.promptText']);

    if(searchTerm) {
      queryBuilder.orWhere(`prompt.promptText LIKE :keyword`, {
        keyword: `${searchTerm}%`,
      });
    }
    
    queryBuilder
    .innerJoin('trainingLog.dataset', 'dataset')
    .addSelect(['dataset.id', 'dataset.name']);

    if(searchTerm) {
      queryBuilder.orWhere(`dataset.name LIKE :keyword`, {
        keyword: `${searchTerm}%`,
      });
    }
    
    queryBuilder
    .innerJoin('trainingLog.gpuInstance', 'gpuInstance')
    .addSelect(['gpuInstance.id', 'gpuInstance.name']);

    if(searchTerm) {
      queryBuilder.orWhere(`gpuInstance.name LIKE :keyword`, {
        keyword: `${searchTerm}%`,
      });
    }
    

    // Order trainingLogs by createdAt timestamp in descending order
    queryBuilder.orderBy('trainingLog.createdAt', 'DESC').addSelect('trainingLog.createdAt');

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
   * Retrieve trainingLogs based on search criteria and user ID for dropdown selection.
   *
   * 
   * @param {string[]} fields - The fields to select in the query.
   * @param {string} keyword - Optional keyword for filtering trainingLogs.
   * @returns {Promise<TrainingLogEntity[]>} - The trainingLogs.
   */
  async findAllDropdown(
    
    fields: string[],
    keyword?: string,
  ): Promise<TrainingLogEntity[]> {
    // Create a query builder to construct the SQL query for retrieving trainingLogs
    const queryBuilder = this.getQueryBuilder( fields, keyword);

    const selectedColumns = fields.map((field) => `trainingLog.${field}`);

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
   * @param {string} keyword - Optional keyword for filtering trainingLogs.
   * @returns {SelectQueryBuilder<TrainingLogEntity>} - The constructed query builder.
   */
  getQueryBuilder(
    
    fields: string[],
    keyword?: string,
  ): SelectQueryBuilder<TrainingLogEntity> {
    // Create a query builder for the 'trainingLog' entity
    const queryBuilder = this.createQueryBuilder('trainingLog');

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (keyword) {
      fields.forEach((field, index) => {
        if (index === 0) {
          queryBuilder.where(`trainingLog.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        } else {
          queryBuilder.orWhere(`trainingLog.${field} LIKE :keyword`, {
            keyword: `${keyword}%`,
          });
        }
      });
    }


    // Return the constructed query builder
    return queryBuilder;
  }

  /**
   * Retrieve a paginated list of trainingLogs by model.
   *
   *
   * @param {number} modelId - The modelId of the trainingLog to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} searchTerm - Optional search term for filter.
   * @returns {Promise<{ result: TrainingLogEntity[]; total: number }>} - The list of trainingLogs and the total count.
   */
  async getTrainingLogsByModelId(
    
    modelId: number,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: TrainingLogEntity[]; total: number }> {

    const fields = [
      'status',
          ];

    // Create a query builder for the 'trainingLog' entity
    const queryBuilder = this.createQueryBuilder('trainingLog');


    // Add a condition to filter comments based on modelId
    queryBuilder.andWhere('trainingLog.model.id = :modelId', { modelId });

    queryBuilder
    .innerJoin('trainingLog.prompt', 'prompt')
    .addSelect(['prompt.id', 'prompt.promptText']);
    
    queryBuilder
    .innerJoin('trainingLog.dataset', 'dataset')
    .addSelect(['dataset.id', 'dataset.name']);
    
    queryBuilder
    .innerJoin('trainingLog.gpuInstance', 'gpuInstance')
    .addSelect(['gpuInstance.id', 'gpuInstance.name']);
    

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (searchTerm) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.orWhere(`prompt.promptText LIKE :keyword`, {
            keyword: `${searchTerm}%`,
          });
          
          qb.orWhere(`dataset.name LIKE :keyword`, {
            keyword: `${searchTerm}%`,
          });
          
          qb.orWhere(`gpuInstance.name LIKE :keyword`, {
            keyword: `${searchTerm}%`,
          });
          
          fields.forEach((field) => {
            qb.orWhere(`trainingLog.${field} LIKE :keyword`, {
              keyword: `${searchTerm}%`,
            });
          });
      }))
    }

    // Order trainingLogs by createdAt timestamp in descending order
    queryBuilder.orderBy('trainingLog.createdAt', 'DESC').addSelect('trainingLog.createdAt');

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
   * Retrieve a paginated list of trainingLogs by prompt.
   *
   *
   * @param {number} promptId - The promptId of the trainingLog to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} searchTerm - Optional search term for filter.
   * @returns {Promise<{ result: TrainingLogEntity[]; total: number }>} - The list of trainingLogs and the total count.
   */
  async getTrainingLogsByPromptId(
    
    promptId: number,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: TrainingLogEntity[]; total: number }> {

    const fields = [
      'status',
          ];

    // Create a query builder for the 'trainingLog' entity
    const queryBuilder = this.createQueryBuilder('trainingLog');


    // Add a condition to filter comments based on promptId
    queryBuilder.andWhere('trainingLog.prompt.id = :promptId', { promptId });

    queryBuilder
    .innerJoin('trainingLog.model', 'model')
    .addSelect(['model.id', 'model.name']);
    
    queryBuilder
    .innerJoin('trainingLog.dataset', 'dataset')
    .addSelect(['dataset.id', 'dataset.name']);
    
    queryBuilder
    .innerJoin('trainingLog.gpuInstance', 'gpuInstance')
    .addSelect(['gpuInstance.id', 'gpuInstance.name']);
    

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (searchTerm) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.orWhere(`model.name LIKE :keyword`, {
            keyword: `${searchTerm}%`,
          });
          
          qb.orWhere(`dataset.name LIKE :keyword`, {
            keyword: `${searchTerm}%`,
          });
          
          qb.orWhere(`gpuInstance.name LIKE :keyword`, {
            keyword: `${searchTerm}%`,
          });
          
          fields.forEach((field) => {
            qb.orWhere(`trainingLog.${field} LIKE :keyword`, {
              keyword: `${searchTerm}%`,
            });
          });
      }))
    }

    // Order trainingLogs by createdAt timestamp in descending order
    queryBuilder.orderBy('trainingLog.createdAt', 'DESC').addSelect('trainingLog.createdAt');

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
   * Retrieve a paginated list of trainingLogs by dataset.
   *
   *
   * @param {number} datasetId - The datasetId of the trainingLog to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} searchTerm - Optional search term for filter.
   * @returns {Promise<{ result: TrainingLogEntity[]; total: number }>} - The list of trainingLogs and the total count.
   */
  async getTrainingLogsByDatasetId(
    
    datasetId: number,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: TrainingLogEntity[]; total: number }> {

    const fields = [
      'status',
          ];

    // Create a query builder for the 'trainingLog' entity
    const queryBuilder = this.createQueryBuilder('trainingLog');


    // Add a condition to filter comments based on datasetId
    queryBuilder.andWhere('trainingLog.dataset.id = :datasetId', { datasetId });

    queryBuilder
    .innerJoin('trainingLog.model', 'model')
    .addSelect(['model.id', 'model.name']);
    
    queryBuilder
    .innerJoin('trainingLog.prompt', 'prompt')
    .addSelect(['prompt.id', 'prompt.promptText']);
    
    queryBuilder
    .innerJoin('trainingLog.gpuInstance', 'gpuInstance')
    .addSelect(['gpuInstance.id', 'gpuInstance.name']);
    

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (searchTerm) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.orWhere(`model.name LIKE :keyword`, {
            keyword: `${searchTerm}%`,
          });
          
          qb.orWhere(`prompt.promptText LIKE :keyword`, {
            keyword: `${searchTerm}%`,
          });
          
          qb.orWhere(`gpuInstance.name LIKE :keyword`, {
            keyword: `${searchTerm}%`,
          });
          
          fields.forEach((field) => {
            qb.orWhere(`trainingLog.${field} LIKE :keyword`, {
              keyword: `${searchTerm}%`,
            });
          });
      }))
    }

    // Order trainingLogs by createdAt timestamp in descending order
    queryBuilder.orderBy('trainingLog.createdAt', 'DESC').addSelect('trainingLog.createdAt');

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
   * Retrieve a paginated list of trainingLogs by gpuInstance.
   *
   *
   * @param {number} gpuInstanceId - The gpuInstanceId of the trainingLog to retrieve.
   * @param {number} skip - The number of items to skip for pagination.
   * @param {number} take - The number of items to take per page for pagination.
   * @param {string} searchTerm - Optional search term for filter.
   * @returns {Promise<{ result: TrainingLogEntity[]; total: number }>} - The list of trainingLogs and the total count.
   */
  async getTrainingLogsByGpuInstanceId(
    
    gpuInstanceId: number,
    skip: number,
    take: number,
    searchTerm?: string,
  ): Promise<{ result: TrainingLogEntity[]; total: number }> {

    const fields = [
      'status',
          ];

    // Create a query builder for the 'trainingLog' entity
    const queryBuilder = this.createQueryBuilder('trainingLog');


    // Add a condition to filter comments based on gpuInstanceId
    queryBuilder.andWhere('trainingLog.gpuInstance.id = :gpuInstanceId', { gpuInstanceId });

    queryBuilder
    .innerJoin('trainingLog.model', 'model')
    .addSelect(['model.id', 'model.name']);
    
    queryBuilder
    .innerJoin('trainingLog.prompt', 'prompt')
    .addSelect(['prompt.id', 'prompt.promptText']);
    
    queryBuilder
    .innerJoin('trainingLog.dataset', 'dataset')
    .addSelect(['dataset.id', 'dataset.name']);
    

    // If a keyword is provided, construct a dynamic query with 'LIKE' and 'OR' conditions for each field
    if (searchTerm) {
      queryBuilder.andWhere(
        new Brackets((qb) => {
          qb.orWhere(`model.name LIKE :keyword`, {
            keyword: `${searchTerm}%`,
          });
          
          qb.orWhere(`prompt.promptText LIKE :keyword`, {
            keyword: `${searchTerm}%`,
          });
          
          qb.orWhere(`dataset.name LIKE :keyword`, {
            keyword: `${searchTerm}%`,
          });
          
          fields.forEach((field) => {
            qb.orWhere(`trainingLog.${field} LIKE :keyword`, {
              keyword: `${searchTerm}%`,
            });
          });
      }))
    }

    // Order trainingLogs by createdAt timestamp in descending order
    queryBuilder.orderBy('trainingLog.createdAt', 'DESC').addSelect('trainingLog.createdAt');

    // Set the select, skip, and take properties for pagination
    queryBuilder.select().take(take).skip(skip);

    // Execute the query and return the result along with the total count
    const [result, total] = await queryBuilder.getManyAndCount();

    return {
      result,
      total,
    };
  }
  
}
