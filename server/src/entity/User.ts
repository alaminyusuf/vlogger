import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn({ type: 'int' })
  public id: number;

  @Field(() => String)
  @Column({ nullable: false, type: 'varchar', unique: true })
  public username: string;

  @Field(() => String)
  @Column({ nullable: false, type: 'varchar', unique: true })
  public email: string;

  @Column({ nullable: false, type: 'varchar' })
  public password: string;
}
