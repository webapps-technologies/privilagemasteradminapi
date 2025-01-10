import { City } from 'src/city/entities/city.entity';
import { Country } from 'src/country/entities/country.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class State {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  name: string;

  @Column({ type: 'boolean', default: false })
  status: boolean;

  @Column({ type: 'uuid', nullable: true })
  countryId: string;

  @OneToMany(() => City, (city) => city.state)
  city: City[];

  @ManyToOne(() => Country, (country) => country.state, {
    cascade: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  country: Country[];
}
