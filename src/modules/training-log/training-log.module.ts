import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrainingLogService } from './training-log.service';
import { TrainingLogController } from './training-log.controller';
import { TrainingLogEntity } from './training-log.entity';
import { TrainingLogRepository } from './training-log.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrainingLogEntity]),
  ],
  controllers: [TrainingLogController],
  providers: [TrainingLogService, TrainingLogRepository],
  exports: [TrainingLogService],
})
export class TrainingLogModule {}
