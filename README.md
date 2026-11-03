Learning backend and documenting as I learn

# Project setup.

npm init -y, npx tsc --init, npm i express @types/express

# Saperating app and server:

- why saperate them? Testing, when we use supertest, which takes the app object and fires requests at it without ever opening a real port. If your app and listen() call live in one file, importing the app in a test starts a real server — slow, flaky, and it leaks ports.

# req object.

- req.params is always a string.
- req.query's shape is untrustable so alywas validate it before using
- req.body only works with app.use(express.json()) json parser

# res object.

- res.json({}) sets content-type:json/application
- res.send("") sets content-type:string html/text
- prefer to use res.json for API and res.send for simple demos
- Rule: always return whenever you send a response inside a branch (if branches)

# Middleware- they are the soul of backend

- its just any function with the signature (req,res,next)=>void;
- it can be used in any route handlers to check or validate or run this before anythings.
- most common is an authentication middleware

# Folder strucutre would be

- middleware, where all the middleware are written.
- routes, main route folder where all routes are written.
- controllers, these are functions and route handlers and business logic.
- services, these are the actual database queries.
- config/env.ts, Here we validate the env vars so that if there are missing types app will crash imediatley instead of failling in the middle of request.

# Routing order matters in express

```ts
app.get("/users/:id", (req, res) => {
  res.send(`User ID: ${req.params.id}`);
});

app.get("/users/me", (req, res) => {
  res.send("My Profile");
});
```

Request:

```
GET /users/me
```

Response:

```
User ID: me
```

The `/users/me` route is never reached because Express matches routes **top to bottom**.

In Express, **first matching route wins**. Always register \*_specific routes before dynamic (`:param`) or wildcard (`_`) routes.

# Error handling

- global error handling means: no mater where or how an error happens, it alwyas ends up in one place that decides what to tell the user and the log.
- there are 2 main types of errors: operational error(which are expected), programming error(unexpected, bugs)
- AppError object, errorHandler middleware, NotfoundHandler.

# Input validation

- Rule: Every time data crosses from outside to inside, it must be validated at runtime, zod is the main player in this validation.
- zod.infer`<typeof schema>` is used to create typescript types from zod schemas.

# URL design rules

- Use /users, /posts, /order-items. Don't use /createUser, /getPost, /deleteOrder. "think in resources, not in actions", "Use plural".
- Two URL shapes per resource: collection /posts and item /posts/:id.
- Limit nesting to ~2 levels. /users/1/posts/42/comments/7/likes/3 is misery.
- kebab-case for multi-word segments (/order-items)
- Query strings are for reading options, never identity: filtering, sorting, pagination, search — /posts?status=published&sort=-createdAt&limit=20.
- No trailing slashes /, no file extensions (.json) — the Content-Type header describes the format.
- URL versioning is important, as renaming, removing, changinf will be needed eventually.

# Database manipulation (postgreSQL)

- raw driver(pg) > query builder (kysely) > drizzle > prisma.
- But still we will start with learning prisma first, cuz its easy to learn, and we work with objects and schemas.
- install prisma, prisma client and its adapter (pg,neon etc...)
- run `npx prisma init` , it will generare 2 files prisma/schema.prisma and prisma.config.ts
- use the prisma schema language and define the schema (structure) for your tabel
- run `npx prisma migrate dev --name init` to generate first migration.
- run `npx prisma generate`, it will create a folder ./src/generated which has the prisma client.
- then create and export the client with the requierd adapter ./src/lib/prisma.ts.
- import and use the client to perform CRUD operations.
- run `npx prisma migrate dev --name migration_name` to migrate a change made into the schema file.

# concurrancy

- the abilty to perfrom multiple tasks at a time.
- nodejs is single threaded and runs on event loop system, so a cpu intensive, or sync I/O process take time while other process has to wait till they execute.
- but async I/O no need to wait, they execute concurently.
- here is the comparision of the delay and blocking using autocannon library to perfrom multiple requests at a time.
- the code for these test are in ./concurrancy/server.js

- first we perform a fake db call which is a async io call which will run in database server, so it will not effect the /health endpoint, below are the reults

npx autocannon -c 1 -d 10 http://localhost:3000/slow-db
Running 10s test @ http://localhost:3000/slow-db
1 connections

┌─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┬─────────┐
│ Stat │ 2.5% │ 50% │ 97.5% │ 99% │ Avg │ Stdev │ Max │
├─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┼─────────┤
│ Latency │ 3021 ms │ 3032 ms │ 3034 ms │ 3034 ms │ 3029 ms │ 5.72 ms │ 3034 ms │
└─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┴─────────┘
┌───────────┬─────┬──────┬─────┬───────┬──────┬───────┬───────┐
│ Stat │ 1% │ 2.5% │ 50% │ 97.5% │ Avg │ Stdev │ Min │
├───────────┼─────┼──────┼─────┼───────┼──────┼───────┼───────┤
│ Req/Sec │ 0 │ 0 │ 0 │ 1 │ 0.3 │ 0.46 │ 1 │
├───────────┼─────┼──────┼─────┼───────┼──────┼───────┼───────┤
│ Bytes/Sec │ 0 B │ 0 B │ 0 B │ 250 B │ 75 B │ 115 B │ 250 B │
└───────────┴─────┴──────┴─────┴───────┴──────┴───────┴───────┘

Req/Bytes counts sampled once per second.

# of samples: 10

4 requests in 10.15s, 750 B read

npx autocannon -c 20 -d 10 http://localhost:3000/health
Running 10s test @ http://localhost:3000/health
20 connections

┌─────────┬──────┬──────┬───────┬───────┬─────────┬─────────┬────────┐
│ Stat │ 2.5% │ 50% │ 97.5% │ 99% │ Avg │ Stdev │ Max │
├─────────┼──────┼──────┼───────┼───────┼─────────┼─────────┼────────┤
│ Latency │ 0 ms │ 3 ms │ 17 ms │ 23 ms │ 4.11 ms │ 5.32 ms │ 134 ms │
└─────────┴──────┴──────┴───────┴───────┴─────────┴─────────┴────────┘
┌───────────┬────────┬────────┬─────────┬─────────┬─────────┬──────────┬────────┐  
│ Stat │ 1% │ 2.5% │ 50% │ 97.5% │ Avg │ Stdev │ Min │  
├───────────┼────────┼────────┼─────────┼─────────┼─────────┼──────────┼────────┤  
│ Req/Sec │ 2,303 │ 2,303 │ 4,093 │ 5,819 │ 4,341.9 │ 1,153.52 │ 2,302 │  
├───────────┼────────┼────────┼─────────┼─────────┼─────────┼──────────┼────────┤  
│ Bytes/Sec │ 573 kB │ 573 kB │ 1.02 MB │ 1.45 MB │ 1.08 MB │ 287 kB │ 573 kB │  
└───────────┴────────┴────────┴─────────┴─────────┴─────────┴──────────┴────────┘

Req/Bytes counts sampled once per second.

# of samples: 10

43k requests in 10.09s, 10.8 MB read

- we can see that the /health endpoint didnt get effected by a db call endpoint and also it didnt introduced any delay.

- now we shall test with a cpu intensive task which should pause the main thread from running other req and seee how it effects

npx autocannon -c 1 -d 10 http://localhost:3000/slow-cpu2
Running 10s test @ http://localhost:3000/slow-cpu2
1 connections

┌─────────┬─────────┬─────────┬─────────┬─────────┬────────────┬──────────┬─────────┐
│ Stat │ 2.5% │ 50% │ 97.5% │ 99% │ Avg │ Stdev │ Max  
 │
├─────────┼─────────┼─────────┼─────────┼─────────┼────────────┼──────────┼─────────┤
│ Latency │ 3004 ms │ 3023 ms │ 3115 ms │ 3115 ms │ 3047.34 ms │ 48.48 ms │ 3115ms │
└─────────┴─────────┴─────────┴─────────┴─────────┴────────────┴──────────┴─────────┘
┌───────────┬─────┬──────┬─────┬───────┬────────┬───────┬───────┐
│ Stat │ 1% │ 2.5% │ 50% │ 97.5% │ Avg │ Stdev │ Min │
├───────────┼─────┼──────┼─────┼───────┼────────┼───────┼───────┤
│ Req/Sec │ 0 │ 0 │ 0 │ 1 │ 0.3 │ 0.46 │ 1 │
├───────────┼─────┼──────┼─────┼───────┼────────┼───────┼───────┤
│ Bytes/Sec │ 0 B │ 0 B │ 0 B │ 245 B │ 73.5 B │ 112 B │ 245 B │
└───────────┴─────┴──────┴─────┴───────┴────────┴───────┴───────┘

Req/Bytes counts sampled once per second.

# of samples: 10

4 requests in 10.12s, 735 B read

npx autocannon -c 20 -d 10 http://localhost:3000/health
Running 10s test @ http://localhost:3000/health
20 connections

┌─────────┬──────┬───────┬─────────┬─────────┬───────────┬────────────┬─────────┐  
│ Stat │ 2.5% │ 50% │ 97.5% │ 99% │ Avg │ Stdev │ Max │  
├─────────┼──────┼───────┼─────────┼─────────┼───────────┼────────────┼─────────┤  
│ Latency │ 7 ms │ 13 ms │ 4234 ms │ 4235 ms │ 886.72 ms │ 1577.94 ms │ 4235 ms │  
└─────────┴──────┴───────┴─────────┴─────────┴───────────┴────────────┴─────────┘  
┌───────────┬─────┬──────┬─────┬─────────┬─────────┬─────────┬─────────┐
│ Stat │ 1% │ 2.5% │ 50% │ 97.5% │ Avg │ Stdev │ Min │
├───────────┼─────┼──────┼─────┼─────────┼─────────┼─────────┼─────────┤
│ Req/Sec │ 0 │ 0 │ 0 │ 126 │ 16.61 │ 38.37 │ 40 │
├───────────┼─────┼──────┼─────┼─────────┼─────────┼─────────┼─────────┤
│ Bytes/Sec │ 0 B │ 0 B │ 0 B │ 31.4 kB │ 4.13 kB │ 9.55 kB │ 9.96 kB │
└───────────┴─────┴──────┴─────┴─────────┴─────────┴─────────┴─────────┘

Req/Bytes counts sampled once per second.

# of samples: 10

186 requests in 10.2s, 41.3 kB read

- ran both the req at a time and we can see that the cpu intensive task effected the /health req in latancy and also req/sec, and will effect in the event loop too.

# worker_threads

- we can use worker_threads to offload these cpu intensive tasks and make sure that other requests are not effected and also the nodejs main thread' event loop is not delayed.
- we are creating a worker in /worker.js file which will offload the cpu intensive task and run indepentdtly.

npx autocannon -c 1 -d 10 http://localhost:3000/slow-cpu
Running 10s test @ http://localhost:3000/slow-cpu
1 connections

┌─────────┬─────────┬─────────┬─────────┬─────────┬────────────┬──────────┬─────────┐
│ Stat │ 2.5% │ 50% │ 97.5% │ 99% │ Avg │ Stdev │ Max  
 │
├─────────┼─────────┼─────────┼─────────┼─────────┼────────────┼──────────┼─────────┤
│ Latency │ 3069 ms │ 3083 ms │ 3176 ms │ 3176 ms │ 3109.34 ms │ 47.49 ms │ 3176ms │
└─────────┴─────────┴─────────┴─────────┴─────────┴────────────┴──────────┴─────────┘
┌───────────┬─────┬──────┬─────┬───────┬───────┬───────┬───────┐
│ Stat │ 1% │ 2.5% │ 50% │ 97.5% │ Avg │ Stdev │ Min │
├───────────┼─────┼──────┼─────┼───────┼───────┼───────┼───────┤
│ Req/Sec │ 0 │ 0 │ 0 │ 1 │ 0.3 │ 0.46 │ 1 │
├───────────┼─────┼──────┼─────┼───────┼───────┼───────┼───────┤
│ Bytes/Sec │ 0 B │ 0 B │ 0 B │ 339 B │ 102 B │ 155 B │ 339 B │
└───────────┴─────┴──────┴─────┴───────┴───────┴───────┴───────┘

Req/Bytes counts sampled once per second.

# of samples: 10

4 requests in 10.11s, 1.02 kB read

npx autocannon -c 20 -d 10 http://localhost:3000/health
Running 10s test @ http://localhost:3000/health
20 connections

┌─────────┬──────┬──────┬───────┬───────┬─────────┬─────────┬────────┐
│ Stat │ 2.5% │ 50% │ 97.5% │ 99% │ Avg │ Stdev │ Max │
├─────────┼──────┼──────┼───────┼───────┼─────────┼─────────┼────────┤
│ Latency │ 0 ms │ 3 ms │ 16 ms │ 22 ms │ 4.32 ms │ 5.32 ms │ 112 ms │
└─────────┴──────┴──────┴───────┴───────┴─────────┴─────────┴────────┘
┌───────────┬────────┬────────┬─────────┬─────────┬──────────┬─────────┬────────┐  
│ Stat │ 1% │ 2.5% │ 50% │ 97.5% │ Avg │ Stdev │ Min │  
├───────────┼────────┼────────┼─────────┼─────────┼──────────┼─────────┼────────┤  
│ Req/Sec │ 3,385 │ 3,385 │ 4,335 │ 4,571 │ 4,167.61 │ 346.91 │ 3,384 │  
├───────────┼────────┼────────┼─────────┼─────────┼──────────┼─────────┼────────┤  
│ Bytes/Sec │ 843 kB │ 843 kB │ 1.08 MB │ 1.14 MB │ 1.04 MB │ 86.4 kB │ 843 kB │  
└───────────┴────────┴────────┴─────────┴─────────┴──────────┴─────────┴────────┘

Req/Bytes counts sampled once per second.

# of samples: 10

42k requests in 10.09s, 10.4 MB read

- we can see that by offloading the cpu intensive task to a worker thread the /health endpoint didnt get effected.
