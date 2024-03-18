import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasetService } from './dataset.service';
import { DatasetController } from './dataset.controller';
import { DatasetEntity } from './dataset.entity';
import { DatasetRepository } from './dataset.repository';
import { TrainingLogModule } from 'src/modules/training-log/training-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DatasetEntity]),
    TrainingLogModule,
  ],
  controllers: [DatasetController],
  providers: [DatasetService, DatasetRepository],
  exports: [DatasetService],
})
export class DatasetModule {}
