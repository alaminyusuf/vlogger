import { Updoot } from './Updoot';
import { Post } from './Post';
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from 'type-graphql';

@ObjectType()
@Entity()
export class User extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn({ type: 'int' })
	public id!: number;

	@Field(() => String)
	@Column({ nullable: false, unique: true })
	public username!: string;

	@Field(() => String)
	@Column({ nullable: false, unique: true })
	public email!: string;

	@OneToMany(() => Post, (post) => post.author)
	posts: Post[];

	@Column({ nullable: false })
	public password!: string;

	@ManyToOne(() => Updoot, (updoot) => updoot.user)
	public updoot: Updoot[];

	@Field(() => String)
	@CreateDateColumn()
	public createdAt: Date;

	@Field(() => String)
	@UpdateDateColumn()
	public updatedAt: Date;
}
