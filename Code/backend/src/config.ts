import dotenv from 'dotenv';
dotenv.config();

export const appConfig = {
    port: process.env.PORT,
    db: {
        name: process.env.MONGO_DB_NAME,
        user: process.env.MONGO_DB_USER,
        pass: process.env.MONGO_DB_PASS,
    }
}