# GraphQL with MongoDb

### 1. **Set up your project**

First, you need to create a new Node.js project and install the required dependencies.

```bash
mkdir graphql-mongodb
cd graphql-mongodb
npm init -y
npm install express express-graphql graphql mongoose
npm install nodemon --save-dev
```

### 2. **Create the MongoDB connection**

Create a file named `db.js` to handle the connection to your MongoDB database.

```javascript
// db.js
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://username:password@cluster0.x4lmd.mongodb.net/books', {});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

module.exports = mongoose;
```

### 3. **Define the Mongoose schema and model**

Create a file named `models.js` for your MongoDB model.

```javascript
// models.js
const mongoose = require('./db');

const BookSchema = new mongoose.Schema({
    title: String,
    author: String,
    publishedYear: Number
});

const Book = mongoose.model('Book', BookSchema);

module.exports = { Book };
```

### 4. **Set up the GraphQL schema**

Create a file named `schema.js` where you'll define your GraphQL schema.

```javascript
// schema.js
const { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLInt, GraphQLList, GraphQLID } = require('graphql');
const { Book } = require('./models');

// Define the Book type
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        author: { type: GraphQLString },
        publishedYear: { type: GraphQLInt }
    })
});

// Define the Root Query
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Book.findById(args.id);
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve() {
                return Book.find({});
            }
        }
    }
});

// Define the Mutation
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addBook: {
            type: BookType,
            args: {
                title: { type: GraphQLString },
                author: { type: GraphQLString },
                publishedYear: { type: GraphQLInt }
            },
            resolve(parent, args) {
                const book = new Book({
                    title: args.title,
                    author: args.author,
                    publishedYear: args.publishedYear
                });
                return book.save();
            }
        }
    }
});

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
```

### 5. **Set up the Express server**

Finally, create the main server file `index.js`.

```javascript
// index.js
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema');

const app = express();

app.use('/graphql', graphqlHTTP({
    schema: schema,
    graphiql: true
}));

app.listen(4000, () => {
    console.log('Server is running on port 4000...');
});
```

### 6. **Run the server**

Add script to start server to `package.json`:

```json
"scripts": {
    "dev": "nodemon index.js"
},
```

You can now run your server using:

```bash
npm run dev
```

Visit `http://localhost:4000/graphql` in your browser. You should see the GraphiQL interface, where you can run queries and mutations against your GraphQL API.

### 7. **Example GraphQL queries and mutations**

**Query:**

```graphql
{
  books {
    id
    title
    author
    publishedYear
  }
}
```

**Mutation:**

```graphql
mutation {
  addBook(title: "The Great Gatsby", author: "F. Scott Fitzgerald", publishedYear: 1925) {
    id
    title
  }
}
```

### Explanation

- **Mongoose** is used to connect to MongoDB and define the data model.
- **GraphQL** is used to create a schema, including types, queries, and mutations.
- **Express** is used to create a server and handle incoming GraphQL requests.

This setup allows you to interact with MongoDB through a GraphQL API, with the capability to add, retrieve, and manage data using GraphQL queries and mutations.
