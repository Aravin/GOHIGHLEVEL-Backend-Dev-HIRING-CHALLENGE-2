import { appConfig } from "../config";

import { MongoClient } from 'mongodb';
const uri = `mongodb+srv://aravin:${appConfig.db.pass}@el-interview.bpz7q.mongodb.net/${appConfig.db.name}?retryWrites=true&w=majority`;
console.log(uri);
export const db = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true } as any);