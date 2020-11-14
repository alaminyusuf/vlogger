import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';
import { Field, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(() => String)
  @PrimaryColumn({ type: 'uuid', nullable: false })
  public id: string;

  @Field(() => String)
  @Column({ nullable: false, type: 'varchar', unique: true })
  public username: string;

  @Field(() => String)
  @Column({ nullable: false, type: 'varchar', unique: true })
  public email: string;

  @Column({ nullable: false, type: 'varchar' })
  public password: string;
}
