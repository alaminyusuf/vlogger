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
import { Updoot } from './Updoot';

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: 'int' })
  public id!: number;

  @Field()
  @ManyToOne(() => User, (user) => user.posts)
  public author!: User;

  @Field(() => Int)
  @Column()
  public authorId!: number;

  @Field(() => String)
  @Column({ nullable: false })
  public content!: string;

  @Field(() => String)
  @Column({ default: 0, type: 'int' })
  public points!: number;

  @Field(() => String)
  @Column({ nullable: false })
  public title!: string;

  @ManyToOne(() => Updoot, (updoot) => updoot.post)
  public updoot: Updoot[];

  @Field(() => String)
  @CreateDateColumn()
  public createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  public updatedAt: Date;
}
