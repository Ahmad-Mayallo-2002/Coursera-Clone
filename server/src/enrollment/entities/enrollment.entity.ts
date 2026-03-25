import { User } from '../../user/entities/user.entity';
import { Course } from '../../course/entities/course.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  type Relation,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('enrollments')
export class Enrollment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, name: 'user_id' })
  userId: string;

  @Column({ type: 'varchar', length: 100, name: 'course_id' })
  courseId: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, default: 0 })
  progress: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => User, (user) => user.enrollments)
  @JoinColumn({ name: 'user' })
  user: Relation<User>;

  @ManyToOne(() => Course, (course) => course.enrollments)
  @JoinColumn({ name: 'course' })
  course: Relation<Course>;
}
