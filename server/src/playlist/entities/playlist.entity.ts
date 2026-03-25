import { Course } from '../../course/entities/course.entity';
import { Video } from '../../video/entities/video.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  type Relation,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';

@Entity('playlists')
export class Playlist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 100, name: 'course_id' })
  courseId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Course, (course) => course.playlists)
  @JoinColumn({ name: 'course' })
  course: Relation<Course>;

  @OneToMany(() => Video, (video) => video.playlist)
  videos: Relation<Video[]>;
}
