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

import { UserEntity } from '../user/user.entity'

@Entity('gpu_instances')
export class GpuInstanceEntity {

  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
    name: string;

  @Column()
    status: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  user: UserEntity;

}
