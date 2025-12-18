import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity({ name: 'users' })
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 150 })
  email: string;

  /**
   * Password:
   * - STRING (varchar)
   * - nullable → supaya akun Google bisa tanpa password
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null,
  })
  password: string | null;

  /**
   * Google OAuth ID
   */
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    default: null,
  })
  googleId: string | null;

  /**
   * Auth provider
   */
  @Column({
    type: 'varchar',
    length: 20,
    nullable: false,
    default: 'local',
  })
  provider: 'local' | 'google';

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;
}
