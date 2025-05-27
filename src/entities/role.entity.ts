import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';

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
  users: any[];

  @ManyToMany('Permission', 'roles', { cascade: false })
  permissions: any[];
}
