import { Course } from '../../course/entities/course.entity';
import { Rating } from '../../rating/entities/rating.entity';
import { User } from '../../user/entities/user.entity';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    OneToOne,
    type Relation,
    UpdateDateColumn,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';

@Entity('teachers')
export class Teacher {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'text' })
    bio!: string;

    @Column({ type: 'text' })
    experience!: string;

    @Column({ type: 'boolean', default: false })
    isActive!: boolean;

    @Column({ type: 'float', default: 0 })
    rating!: number;

    @Column({ type: 'varchar', length: 100, name: 'user_id' })
    userId!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    // Relationships
    @OneToOne(() => User, (user) => user.teacher)
    @JoinColumn({ name: 'user' })
    user!: Relation<User>;

    @OneToMany(() => Course, (course) => course.teacher)
    courses!: Relation<Course[]>;

    @OneToMany(() => Rating, (rating) => rating.teacher)
    ratings!: Relation<Rating[]>;
}
