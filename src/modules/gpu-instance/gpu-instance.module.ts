import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GpuInstanceService } from './gpu-instance.service';
import { GpuInstanceController } from './gpu-instance.controller';
import { GpuInstanceEntity } from './gpu-instance.entity';
import { GpuInstanceRepository } from './gpu-instance.repository';
import { TrainingLogModule } from 'src/modules/training-log/training-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GpuInstanceEntity]),
    TrainingLogModule,
  ],
  controllers: [GpuInstanceController],
  providers: [GpuInstanceService, GpuInstanceRepository],
  exports: [GpuInstanceService],
})
export class GpuInstanceModule {}
