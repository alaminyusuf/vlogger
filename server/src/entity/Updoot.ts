import { BaseEntity, PrimaryColumn, Entity, ManyToOne, Column } from 'typeorm';
import { User } from './User';
import { Post } from './Post';

@Entity()
export class Updoot extends BaseEntity {
	@Column({ type: 'boolean', default: false, nullable: true })
	value: boolean;

	@ManyToOne(() => User, (user) => user.updoot)
	user: User;

	@PrimaryColumn()
	userId: number;

	@ManyToOne(() => Post, (post) => post.updoot)
	post: Post;

	@PrimaryColumn()
	postId: number;
}
