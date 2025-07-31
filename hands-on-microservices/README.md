# hands-on-microservices

Code and notes from studying [Hands-On Microservices with JavaScript: Build scalable web applications with JavaScript, Node.js, and Docker](https://www.packtpub.com/en-us/product/hands-on-microservices-with-javascript-9781788625265)

See author's [GitHub repository](https://github.com/PacktPublishing/Hands-on-Microservices-with-JavaScript).

## Chapter 4: Stack Development Technologies

### Understanding and installing Apache Kafka

Run MongoDB, Zookeeper, Kafka, and Kafka UI with Docker Compose:

```sh
cd Ch04
docker compose up -d
```

You can browse to <http://localhost:9100/> and see Kafka UI.

You can also install tools like [Mongo Compass](https://www.mongodb.com/try/download/compass) to browse the MongoDB instance that is available on  localhost:27017 from Docker Compose network.

## Chapter 5: Basic CRUD Microservices

### Preparing our first project

See directory "Ch05".

We are adding the following dependencies to `package.json`:

```json
  "dependencies": {
    "dotenv": "^17.2.0",
    "express": "^5.1.0",
    "joi": "^17.13.3",
    "mongoose": "^8.16.4"
  }
```

Then we are adding sub-folders `configs` and `src`.

In `configs` we add `.env.` file:

```sh
PORT=3001
MONGODB_URL=mongodb://localhost:27017/account-microservice
```

In `src` we implement an MVC project.

In the `models/account.js` we apply `{ optimisticConcurrency: true }` - this option is used for optimistic concurrency control, which is a mechanism that helps prevent data inconsistencies during updates. See: (<https://mongoosejs.com/docs/guide.html#optimisticConcurrency>).

Make sure you start the MongoDB from Ch04:

```sh
docker compose up -d
```

Then from Ch05 run:

```sh
npm install
cd src
node index.js
```

## Chapter 6: Synchronous Microservices - transaction microservice

We implement transaction microservice with NextJS, Docker, Prisma ORM, PostgreSQL.

First we install NextJS globally: `npm i -g @nestjs/cli`.

Then we create NextJS microservice: `nest new transactionservice`

We can run the generated service:

```sh
cd transactionservice
npm run start:dev
```

And now we can browse to it at <http://localhost:3000>.

### Dockerizing your PostgreSQL instance

Crate `docker-compose.yml`. We setup postgresql server and expose on port 5438, and PgAdmin that is exposed on port 5050.

Instead of directly adding credentials/values to the docker-compose file, we can specify it from an `.env` file.

### Prisma ORM

Next we install Prisma ORM: `npm install prisma -D`.

Next we run the Prisma CLI: `npx prisma init`. It creates an additional folder called _./prisma_.

Then we add `DATABASE_URL` to the `.env` file.

The generated file _prisma\schema.prisma_ acts as your database blueprint with three key sections:

- `generator:` This section configures the Prisma Client generator. The Prisma Client, a powerful API, is then generated to help you access your database.

- `datasource:` Here, you define the database connection details. This includes the database provider and the connection string, often leveraging the DATABASE_URL environment variable for convenience.

- `Model:` This is where the heart of your database schema lies. You define the structure of your data by specifying tables and their corresponding fields.

Then we model the data in _./prisma/schema.prisma_. We add `Transaction` model and enum for status.

We start the docker services

Then we run from the command line this command to generate a migration:

```sh
npx prisma migrate dev --name init

Environment variables loaded from .env
Prisma schema loaded from prisma\schema.prisma
Datasource "db": PostgreSQL database "tservice_db", schema "public" at "localhost:5438"

Applying migration `20250728010509_init`

The following migration(s) have been created and applied from new schema changes:

prisma\migrations/
  └─ 20250728010509_init/
    └─ migration.sql

Your database is now in sync with your schema.

Running generate... (Use --skip-generate to skip the generators)

✔ Generated Prisma Client (v6.12.0) to .\generated\prisma in 103ms
```

You can browse to PG-Admin at <http://localhost:5050/browser/> and then add connection to database server

- Connection name: tservice_db
- Hostname: postgres
- Port: 5432
- Maintenance DB: postgres
- Username: postgres
- Password: postgres

And you should be able to connect to tsservice_db database and see the table "Transactions". You should also see the table "_prisma_migrations".
