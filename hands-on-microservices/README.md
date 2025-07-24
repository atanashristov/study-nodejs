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
