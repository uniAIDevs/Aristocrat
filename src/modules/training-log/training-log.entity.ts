import { 
  Entity, 
  Column, 
  PrimaryGeneratedColumn, 
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  ManyToOne, 
  OneToMany, 
  ManyToMany,
  OneToOne,
  JoinColumn
} from 'typeorm';

import { ModelEntity } from '../model/model.entity'
import { PromptEntity } from '../prompt/prompt.entity'
import { DatasetEntity } from '../dataset/dataset.entity'
import { GpuInstanceEntity } from '../gpu-instance/gpu-instance.entity'

@Entity('training_logs')
export class TrainingLogEntity {

  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
    status: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(() => ModelEntity, (model) => model.id, { onDelete: 'CASCADE' })
  model: ModelEntity;

  @ManyToOne(() => PromptEntity, (prompt) => prompt.id, { onDelete: 'CASCADE' })
  prompt: PromptEntity;

  @ManyToOne(() => DatasetEntity, (dataset) => dataset.id, { onDelete: 'CASCADE' })
  dataset: DatasetEntity;

  @ManyToOne(() => GpuInstanceEntity, (gpuInstance) => gpuInstance.id, { onDelete: 'CASCADE' })
  gpuInstance: GpuInstanceEntity;

}
