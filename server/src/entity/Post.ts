import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: 'int' })
  public id: number;

  @Field(() => String)
  @Column({ nullable: false, type: 'varchar' })
  public title: string;

  @Field(() => String)
  @Column({ nullable: false, type: 'varchar' })
  public content: string;

  @Field(() => String)
  @Column({ nullable: false, type: 'varchar' })
  public author: string;
}
