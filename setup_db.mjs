import {db} from './db.mjs';

await db.run('CREATE TABLE totalpoints (points INTEGER);');
await db.run('INSERT INTO totalpoints (points) VALUES (0);');

db.close();
