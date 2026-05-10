import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { LiveStream } from "./entity/LiveStream";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "vlogs-db",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "vlogs",
    synchronize: true,
    logging: false,
    entities: [User, LiveStream],
    migrations: ["src/migration/**/*.ts"],
    subscribers: [],
});
