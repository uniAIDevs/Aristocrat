import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromptService } from './prompt.service';
import { PromptController } from './prompt.controller';
import { PromptEntity } from './prompt.entity';
import { PromptRepository } from './prompt.repository';
import { TrainingLogModule } from 'src/modules/training-log/training-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PromptEntity]),
    TrainingLogModule,
  ],
  controllers: [PromptController],
  providers: [PromptService, PromptRepository],
  exports: [PromptService],
})
export class PromptModule {}
