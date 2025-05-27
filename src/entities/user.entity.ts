import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
  Index,
} from 'typeorm';
import { Exclude } from 'class-transformer';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  @Index('idx_users_email')
  email: string;

  @Column({ type: 'varchar', length: 255, name: 'password_hash' })
  @Exclude()
  passwordHash: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  // Relaciones Many-to-Many
  @ManyToMany('Role', 'users', { cascade: false })
  @JoinTable({
    name: 'user_roles',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'role_id', referencedColumnName: 'id' },
  })
  roles: any[];

  @ManyToMany('Project', 'users', { cascade: false })
  @JoinTable({
    name: 'user_projects',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'project_id', referencedColumnName: 'id' },
  })
  projects: any[];

  @ManyToMany('OrganizationalUnit', 'users', { cascade: false })
  @JoinTable({
    name: 'user_organizational_units',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: {
      name: 'organizational_unit_id',
      referencedColumnName: 'id',
    },
  })
  organizationalUnits: any[];

  // Relaciones One-to-Many para transfers
  @OneToMany('Transfer', 'client')
  clientTransfers: any[];

  @OneToMany('Transfer', 'transmitter')
  transmitterTransfers: any[];
}
