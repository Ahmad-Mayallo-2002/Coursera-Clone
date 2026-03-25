import { Course } from '../../course/entities/course.entity';
import { Playlist } from '../../playlist/entities/playlist.entity';
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

@Entity('videos')
export class Video {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'varchar', length: 255 })
  url: string;

  @Column({ type: 'varchar', length: 100, name: 'course_id' })
  courseId: string;

  @Column({ type: 'varchar', length: 100, name: 'playlist_id', nullable: true })
  playlistId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relationships
  @ManyToOne(() => Course, (course) => course.videos)
  @JoinColumn({ name: 'course' })
  course: Relation<Course>;

  @ManyToOne(() => Playlist, (playlist) => playlist.videos)
  @JoinColumn({ name: 'playlist' })
  playlist: Relation<Playlist>;
}
