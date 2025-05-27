import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Check,
} from 'typeorm';

@Entity('transfers')
@Check('chk_client_transmitter_different', '"client_id" <> "transmitter_id"')
export class Transfer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  type: string; // e.g., 'Venta', 'Donación', 'Traspaso Interno'

  @Column({ name: 'vehicle_id' })
  @Index('idx_transfers_vehicle_id')
  vehicleId: number;

  @Column({ name: 'client_id' })
  @Index('idx_transfers_client_id')
  clientId: number;

  @Column({ name: 'transmitter_id' })
  @Index('idx_transfers_transmitter_id')
  transmitterId: number;

  @Column({ name: 'project_id' })
  @Index('idx_transfers_project_id')
  projectId: number;

  @Column({ name: 'organizational_unit_id' })
  @Index('idx_transfers_organizational_unit_id')
  organizationalUnitId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  // Relaciones
  @ManyToOne('Vehicle', 'transfers', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'vehicle_id' })
  vehicle: any;

  @ManyToOne('User', 'clientTransfers', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'client_id' })
  client: any;

  @ManyToOne('User', 'transmitterTransfers', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'transmitter_id' })
  transmitter: any;

  @ManyToOne('Project', { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'project_id' })
  project: any;

  @ManyToOne('OrganizationalUnit', { onDelete: 'RESTRICT' })
  @JoinColumn([
    { name: 'organizational_unit_id', referencedColumnName: 'id' },
    { name: 'project_id', referencedColumnName: 'projectId' },
  ])
  organizationalUnit: any;
}
