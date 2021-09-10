import { appConfig } from "../config";

import { MongoClient } from 'mongodb';
const uri = `mongodb+srv://aravin:${appConfig.db.pass}@highlevel-interview.bpz7q.mongodb.net/${appConfig.db.name}?retryWrites=true&w=majority`;
export const db = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true } as any);

