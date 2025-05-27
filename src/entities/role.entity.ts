import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Permission } from './permission.entity';
import { User } from './user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  // Relaciones Many-to-Many
  @ManyToMany('User', 'roles')
  users: User[];

  @ManyToMany('Permission', 'roles', { cascade: false })
  permissions: Permission[];
}
