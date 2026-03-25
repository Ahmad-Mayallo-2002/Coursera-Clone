import { Category } from '../../category/entities/category.entity';
import { Enrollment } from '../../enrollment/entities/enrollment.entity';
import { CourseLevel } from '../../enum/courseLevel';
import { Playlist } from '../../playlist/entities/playlist.entity';
import { Rating } from '../../rating/entities/rating.entity';
import { Teacher } from '../../teacher/entities/teacher.entity';
import { Video } from '../../video/entities/video.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  type Relation,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
  OneToMany,
} from 'typeorm';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  image: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'enum', enum: CourseLevel })
  level: CourseLevel;

  @Column({ type: 'varchar', length: 100, name: 'teacher_id' })
  teacherId: string;

  @Column({ type: 'varchar', length: 100, name: 'category_id' })
  categoryId: string;

  @Column({ type: 'float', default: 0 })
  rating: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Teacher, (teacher) => teacher.courses)
  @JoinColumn({ name: 'teacher' })
  teacher: Relation<Teacher>;

  @ManyToOne(() => Category, (category) => category.courses)
  @JoinColumn({ name: 'category' })
  category: Relation<Category>;

  @OneToMany(() => Rating, (rating) => rating.course)
  ratings: Relation<Rating[]>;

  @OneToMany(() => Playlist, (playlist) => playlist.course)
  playlists: Relation<Playlist[]>;

  @OneToMany(() => Video, (video) => video.course)
  videos: Relation<Video[]>;

  @OneToMany(() => Enrollment, (enrollment) => enrollment.course)
  enrollments: Relation<Enrollment[]>;
}
