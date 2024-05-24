import { Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'queryLog',
})
export class QueryLog {
  @PrimaryGeneratedColumn('uuid')
  @Index({
    unique: true,
  })
  id: string;
}
