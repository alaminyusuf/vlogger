import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';
import { User } from './User';

@ObjectType()
@Entity()
export class LiveStream extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  title: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description: string;

  @Field(() => Boolean)
  @Column({ default: true })
  isActive: boolean;

  @Field(() => String)
  @Column({ default: 'live' })
  status: string; // live, ended, scheduled

  @Field(() => Int)
  @Column({ default: 0 })
  viewerCount: number;

  @Column({ unique: true })
  streamKey: string;

  @Field(() => Int)
  @Column()
  creatorId: number;

  @Field(() => User)
  @ManyToOne(() => User, (user) => user.liveStreams)
  creator: User;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updatedAt: Date;
}
