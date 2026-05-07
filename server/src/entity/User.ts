// ...existing code...
import {
	BaseEntity,
	Column,
	CreateDateColumn,
	Entity,
	ManyToOne,
	OneToMany,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from "typeorm";
import { LiveStream } from "./LiveStream";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
@Entity()
export class User extends BaseEntity {
	@Field(() => Int)
	@PrimaryGeneratedColumn({ type: "int" })
	public id!: number;

	@Field(() => String)
	@Column({ nullable: false, unique: true })
	public username!: string;

	@Field(() => String)
	@Column({ nullable: false, unique: true })
	public email!: string;

	// ...existing code...

	@Column({ nullable: false })
	public password!: string;

	// ...existing code...

	@Field(() => [LiveStream])
	@OneToMany(() => LiveStream, (ls) => ls.creator)
	liveStreams: LiveStream[];

	@Field(() => String)
	@CreateDateColumn()
	public createdAt: Date;

	@Field(() => String)
	@UpdateDateColumn()
	public updatedAt: Date;
}
