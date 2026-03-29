import { Course } from '../../course/entities/course.entity';
import { RatingType } from '../../enum/ratingType.enum';
import { Teacher } from '../../teacher/entities/teacher.entity';
import { User } from '../../user/entities/user.entity';
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

@Entity('ratings')
export class Rating {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'float', default: 0 })
    value!: number;

    @Column({ type: 'enum', enum: RatingType })
    type!: RatingType;

    @Column({ type: 'varchar', length: 100, name: 'user_id' })
    userId!: string;

    @Column({ type: 'varchar', length: 100, name: 'course_id', nullable: true })
    courseId!: string;

    @Column({ type: 'varchar', length: 100, name: 'teacher_id', nullable: true })
    teacherId!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    // Relationships
    @ManyToOne(() => User, (user) => user.ratings)
    @JoinColumn({ name: 'user' })
    user!: Relation<User>;

    @ManyToOne(() => Course, (course) => course.ratings)
    @JoinColumn({ name: 'course' })
    course!: Relation<Course>;

    @ManyToOne(() => Teacher, (teacher) => teacher.ratings)
    @JoinColumn({ name: 'teacher' })
    teacher!: Relation<Teacher>;
}
