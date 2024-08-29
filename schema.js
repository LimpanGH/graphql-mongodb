const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLID,
  GraphQLFloat,
} = require("graphql");
const { Book } = require("./models");
const { Movie } = require("./models");

const BookType = new GraphQLObjectType({
  name: "Book",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    author: { type: GraphQLString },
    publishedYear: { type: GraphQLInt },
  }),
});

const MovieType = new GraphQLObjectType({
  name: "Movie",
  fields: () => ({
    id: { type: GraphQLID },
    plot: { type: GraphQLString },
    genres: { type: new GraphQLList(GraphQLString) },
    runtime: { type: GraphQLInt },
    cast: { type: new GraphQLList(GraphQLString) },
    num_mflix_comments: { type: GraphQLInt },
    poster: { type: GraphQLString },
    title: { type: GraphQLString },
    lastupdated: { type: GraphQLString },
    languages: { type: new GraphQLList(GraphQLString) },
    released: { type: GraphQLString },
    directors: { type: new GraphQLList(GraphQLString) },
    rated: { type: GraphQLString },
    awards: {
      type: new GraphQLObjectType({
        name: "Awards",
        fields: {
          wins: { type: GraphQLInt },
          nominations: { type: GraphQLInt },
          text: { type: GraphQLString },
        },
      }),
    },
    year: { type: GraphQLInt },
    imdb: {
      type: new GraphQLObjectType({
        name: "IMDB",
        fields: {
          rating: { type: GraphQLFloat },
          votes: { type: GraphQLInt },
          id: { type: GraphQLInt },
        },
      }),
    },
    countries: { type: new GraphQLList(GraphQLString) },
    type: { type: GraphQLString },
    tomatoes: {
      type: new GraphQLObjectType({
        name: "Tomatoes",
        fields: {
          viewer: {
            type: new GraphQLObjectType({
              name: "Viewer",
              fields: {
                rating: { type: GraphQLFloat },
                numReviews: { type: GraphQLInt },
                meter: { type: GraphQLInt },
              },
            }),
          },
          dvd: { type: GraphQLString },
          lastUpdated: { type: GraphQLString },
        },
      }),
    },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    book: {
      type: BookType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Book.findById(args.id);
      },
    },
    books: {
      type: new GraphQLList(BookType),
      resolve() {
        return Book.find({});
      },
    },
    movie: {
      type: MovieType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Movie.findById(args.id);
      },
    },
    movies: {
      type: new GraphQLList(MovieType),
      args: {
        limit: { type: GraphQLInt },
        page: { type: GraphQLInt },
        sortBy: { type: GraphQLString },
        orderBy: { type: GraphQLString },
      },
      resolve(parent, args) {
        const limit = args.limit || 10; // Default to 10 if limit is not provided
        const offset = args.offset || 0; // Default to 0 if offset is not provided
        const sortField = args.sortBy || "title"; // Default to 'title' if sortBy is not provided
        const sortOrder = args.orderBy === "desc" ? -1 : 1; // Sort order: -1 for desc, 1 for asc
        const filter = {
          [sortField]: { $type: 16 },
        };

        console.log("sortField", sortField);

        const movies = Movie.find(filter)
          .sort({ [sortField]: sortOrder })
          .skip(offset)
          .limit(limit);
        return movies;
      },
    },
  },
});

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addBook: {
      type: BookType,
      args: {
        title: { type: GraphQLString },
        author: { type: GraphQLString },
        publishedYear: { type: GraphQLInt },
      },
      resolve(parent, args) {
        const book = new Book({
          title: args.title,
          author: args.author,
          publishedYear: args.publishedYear,
        });
        return book.save();
      },
    },
    updateBook: {
      type: BookType,
      args: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        author: { type: GraphQLString },
        publishedYear: { type: GraphQLInt },
      },
      async resolve(parent, args) {
        const updatedBook = await Book.findByIdAndUpdate(
          args.id,
          {
            $set: {
              title: args.title,
              author: args.author,
              publishedYear: args.publishedYear,
            },
          },
          { new: true } // This option returns the updated document
        );
        return updatedBook;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
