Learning backend and documenting as I learn

- Project setup.
  npm init -y, npx tsc --init, npm i express @types/express

- Saperating app and server:
  why saperate them? Testing, when we use supertest, which takes the app object and fires requests at it without ever opening a real port. If your app and listen() call live in one file, importing the app in a test starts a real server — slow, flaky, and it leaks ports.

- req object.
  req.params is always a string.
  req.query's shape is untrustable so alywas validate it before using
  req.body only works with app.use(express.json()) json parser

- res object.
  res.json({}) sets content-type:json/application
  res.send("") sets content-type:string html/text
  -->prefer to use res.json for API and res.send for simple demos
  Rule: always return whenever you send a response inside a branch (if branches)

- middleware- they are the soul of backend
  its just any function with the signature (req,res,next)=>void;
  it can be used in any route handlers to check or validate or run this before anythings.
  most common is an authentication middleware

- folder strucutre would be
  middleware, where all the middleware are written.
  routes, main route folder where all routes are written.
  controllers, these are functions and route handlers and business logic.
  services, these are the actual database queries.
  config/env.ts, Here we validate the env vars so that if there are missing types app will crash imediatley instead of failling in the middle of request.

- routing order matters in express

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

- error handling
  global error handling means: no mater where or how an error happens, it alwyas ends up in one place that decides what to tell the user and the log.
  -- there are 2 main types of errors: operational error(which are expected), programming error(unexpected, bugs)
  -- AppError object, errorHandler middleware, NotfoundHandler.

- input validation
  Rule: Every time data crosses from outside to inside, it must be validated at runtime, zod is the main player in this validation.
  zod.infer<typeof schema> is used to create typescript types from zod schemas.
