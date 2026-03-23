import { Enrollment } from 'src/enrollment/entities/enrollment.entity';
import { Role } from 'src/enum/role.enum';
import { Rating } from 'src/rating/entities/rating.entity';
import { Teacher } from 'src/teacher/entities/teacher.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  type Relation,
  UpdateDateColumn,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  username: string;

  @Column({ type: 'varchar', length: 100 })
  email: string;

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.STUDENT,
  })
  role: Role;

  @Column({ type: 'varchar', length: 255, nullable: true })
  image: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @OneToOne(() => Teacher, (teacher) => teacher.user)
  teacher: Relation<Teacher>;

  @OneToMany(() => Rating, (rating) => rating.user)
  ratings: Relation<Rating[]>;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.user)
  enrollments: Relation<Enrollment[]>;
}
