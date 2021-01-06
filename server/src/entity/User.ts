import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: 'int' })
  public id: number;

  @Field(() => String)
  @CreateDateColumn()
  public createdAt: Date;

  @Field(() => String)
  @UpdateDateColumn()
  public updatedAt: Date;

  @Field(() => String)
  @Column({ nullable: false, type: 'varchar', unique: true })
  public username: string;

  @Field(() => String)
  @Column({ nullable: false, type: 'varchar', unique: true })
  public email: string;

  @Column({ nullable: false, type: 'varchar' })
  public password: string;
}
