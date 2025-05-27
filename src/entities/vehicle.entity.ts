import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';

@Entity('vehicles')
export class Vehicle {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, unique: true })
  @Index('idx_vehicles_plate')
  plate: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  service: string; // e.g., 'Particular', 'Público'

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  // Relaciones
  @OneToMany('Transfer', 'vehicle')
  transfers: any[];
}
