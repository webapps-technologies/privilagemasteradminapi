import { State } from 'src/state/entities/state.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class City {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @Column({ type: 'int', nullable: true })
  stateId: number;

  @ManyToOne(() => State, (state) => state.city, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  state: State[];
}
