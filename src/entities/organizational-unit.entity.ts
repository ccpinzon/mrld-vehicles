import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';

@Entity('organizational_units')
@Unique('uq_org_unit_id_project_id', ['id', 'projectId'])
export class OrganizationalUnit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ name: 'project_id' })
  @Index('idx_organizational_units_project_id')
  projectId: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  // Relaciones
  @ManyToOne('Project', 'organizationalUnits', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: any;

  @ManyToMany('User', 'organizationalUnits')
  users: any[];
}
