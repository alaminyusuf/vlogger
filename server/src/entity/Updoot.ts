import { BaseEntity, PrimaryColumn, Entity, ManyToOne, Column } from 'typeorm';
import { User } from './User';
import { Post } from './Post';

@Entity()
export class Updoot extends BaseEntity {
	@Column({ type: 'int' })
	value: number;

	@ManyToOne(() => User, (user) => user.updoot)
	user: User;

	@PrimaryColumn()
	userId: number;

	@ManyToOne(() => Post, (post) => post.updoot)
	post: Post;

	@PrimaryColumn()
	postId: number;
}
