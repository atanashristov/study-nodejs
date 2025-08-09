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

### Seeding test data

Add a `seed.ts` file under the prisma folder with the following content.

Go to `package.json` and add the following after devDependencies:

```json
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
```

Then run this command:

```sh
npx prisma db seed
```

### Implementing the transaction service

First, we create our module using the `npx nest generate module prisma` command.

Prisma CLI command should generate a new folder called `prisma` in `src` and a module `src/prisma/prisma.module.ts`.

If you get errors that the command cannot find some nestjs module, most likely you have corrupted lock file.

Run:

```sh
del package-lock.json
rmdir node_modules
npx prisma generate
npx nest generate module prisma
```

Then generate a service: `npx nest generate service prisma`.

### Install Swagger

Next install Swagger: `npm install --save @nestjs/swagger swagger-ui-express`,
then add it to `src/main.ts`.

You can start the app with `npm run start:dev` and examine: <http://localhost:3000/api>

### Working on transaction implementation

Generate resource for transaction with `npx nest generate resource transaction`.

Specify REST API for transport protocol.

Select Y for CRUD generation.

```sh
 transactionservice  npx nest generate resource transaction
✔ What transport layer do you use? REST API
✔ Would you like to generate CRUD entry points? Yes
CREATE src/transaction/transaction.controller.ts (1064 bytes)
CREATE src/transaction/transaction.controller.spec.ts (646 bytes)
CREATE src/transaction/transaction.module.ts (299 bytes)
CREATE src/transaction/transaction.service.ts (731 bytes)
CREATE src/transaction/transaction.service.spec.ts (513 bytes)
CREATE src/transaction/dto/create-transaction.dto.ts (38 bytes)
CREATE src/transaction/dto/update-transaction.dto.ts (196 bytes)
CREATE src/transaction/entities/transaction.entity.ts (29 bytes)
UPDATE src/app.module.ts (415 bytes)
```

We only implement:

```sh
Get all transactions (GET /transaction)
Get transaction by ID (GET /transaction/{id} )
Create transaction (POST /transaction)
```

So, we remove the following files:

```sh
transaction/transaction.controller.spec.ts
transaction/dto/update-transaction.dto.ts
transaction/transaction.service.spec.ts
```

We remove the following code blocks:

```sh
remove and update functions from transaction.service.ts
remove and update functions from transaction.controller.ts
```

We also remove the following files too:

```sh
app.controller.ts
app.module.ts
app.service.ts
```

We update `main.ts` to work with `TransactionModule`, not `AppModule`.

We integrate the `PrismaClient` class in `transaction.module.ts`, which will help us communicate with the DB.

We import and inject `PrismaService` in `transaction.service.ts`.

Then we change `findAll` method:

```ts
  findAll() {
    return this.prisma.transaction.findMany();
  }
```

You can now execute `GET /transaction` from the Swagger page and it should return the seed transaction.

Similarly we implement the `findOne`...

Next we work on `CreateTransactionDto` so that we can finish the POST create method.

We install `class-validator`:

```sh
npm install class-validator
npm run start:dev
```

and modify `create-transaction.dto.ts`:

```ts
import { IsString, IsOptional, IsEnum, IsNotEmpty, IsUUID }
  from 'class-validator';

enum Status {
  CREATED = 'CREATED',
  SETTLED = 'SETTLED',
  FAILED = 'FAILED',
}

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsEnum(Status)
  status: Status;

  @IsUUID()
  @IsNotEmpty()
  accountID: string;

  @IsOptional()
  @IsString()
  description?: string;
}

```

We can now run `POST /transaction` from Swagger UI, sending a create transaction JSON payload:

```json
{
  "status": "CREATED",
  "accountId": "662c081370bd2ba6b5f04e94",
  "description": "Optional transaction description"
}
```
