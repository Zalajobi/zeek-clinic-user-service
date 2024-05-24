import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QueryLogType } from '@typeorm/entity/enums';

@Entity({
  name: 'queryLog',
})
export class QueryLog {
  @PrimaryGeneratedColumn('uuid')
  @Index({
    unique: true,
  })
  id: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  query: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  error: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  parameters: string;

  @Column({
    type: 'enum',
    enum: QueryLogType,
    nullable: true,
  })
  logType: QueryLogType;

  @CreateDateColumn()
  createdAt: Date;
}
