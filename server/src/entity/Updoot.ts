import { BaseEntity, PrimaryColumn, Entity, ManyToOne, Column } from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';
import { User } from './User';
import { Post } from './Post';

@ObjectType()
@Entity()
export class Updoot extends BaseEntity {
  @Field(() => Int)
  @Column({ type: 'int' })
  value: number;

  @Field()
  @ManyToOne(() => User, (user) => user.updoot)
  public user!: number;

  @Field(() => Int)
  @PrimaryColumn()
  public userId!: number;

  @Field()
  @ManyToOne(() => Post, (post) => post.updoot)
  public post!: Post;

  @Field(() => Int)
  @PrimaryColumn()
  public postId!: number;
}
