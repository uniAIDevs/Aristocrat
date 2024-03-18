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


@Entity('models')
export class ModelEntity {

  @Index()
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
    name: string;

  @Column()
    label: string;

  @Column()
    huggingfaceId: string;

  @Column({type:"text"})
    documentation: string;

  @CreateDateColumn({ select: false })
  createdAt: Date;

  @UpdateDateColumn({ select: false })
  updatedAt: Date;

}
