import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModelService } from './model.service';
import { ModelController } from './model.controller';
import { ModelEntity } from './model.entity';
import { ModelRepository } from './model.repository';
import { TrainingLogModule } from 'src/modules/training-log/training-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ModelEntity]),
    TrainingLogModule,
  ],
  controllers: [ModelController],
  providers: [ModelService, ModelRepository],
  exports: [ModelService],
})
export class ModelModule {}
