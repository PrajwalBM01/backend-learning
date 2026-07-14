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
