const {ApolloServer, gql} = require('apollo-server');
const {PrismaClient, prisma} = require('@prisma/client');

const client = new PrismaClient();

const typeDefs = gql`
  type Book {
    name: String!
    author: String!
  }
  type Something {
    price: Int!
  }
  input User {
    first_name: String!
    last_name: String!
    email: String!
  }

  type RegistredUser {
    first_name: String!
    last_name: String!
    email: String!
    createdAt: String!
    id: Int!
  }

  type Query {
    getRegistration: [RegistredUser]
  }
  type Mutation {
    registerUser(user: User): Boolean!
    removeUser(ids: [Int]!): Boolean!
    removeAllUsers: Boolean!
  }
`;

const server = new ApolloServer({
  typeDefs,
  playground: true,
  context: (req, res) => {
    return {isAdmin: true};
  },
  resolvers: {
    Mutation: {
      removeAllUsers: (_, args, ctx) =>
        ctx.isAdmin &&
        client.registration
          .deleteMany()
          .then((val) => true)
          .catch((val) => false),
      removeUser: (_, args, ctx) =>
        ctx.isAdmin &&
        client.registration
          .deleteMany({
            where: {
              Id: {in: args.ids},
            },
          })
          .then(() => true)
          .catch(() => false),
      registerUser: (_, args, ctx) =>
        client.registration
          .create({data: args.user})
          .then(() => true)
          .catch(() => false),
    },
    Query: {
      getRegistration: (_, args, ctx) =>
        ctx.isAdmin
          ? client.registration
              .findMany()
              .then((val) => val.map((d) => ({...d, id: d.Id})))
          : [],
    },
  },
});

server.listen(3000).then((val) => console.log(val.url));
