import { ApolloServer, UserInputError, gql } from "apollo-server";
import { v1 as uuid } from "uuid";

const persons = [
  {
    name: "Pablo",
    phone: "123",
    street: "Calle falsa",
    city: "Resistencia",
    id: "1",
  },
  {
    name: "Leandro",
    phone: "321",
    street: "Calle Baker",
    city: "Manchester",
    id: "2",
  },
  {
    name: "Antonio",
    phone: "543",
    street: "Calle nombre",
    city: "Barranqueras",
    id: "3",
  },
];

const typeDefs = gql`
  type Address {
    street: String!
    city: String!
  }
  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }
  type Query {
    personCount: Int!
    allPersons: [Person]!
    findPerson(name: String!): Person
  }
  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
  }
`;
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: () => persons,
    findPerson: (root, args) => {
      const { name } = args;
      return persons.find((person) => person.name === name);
    },
  },
  Mutation: {
    addPerson: (root, args) => {
      if (persons.find((p) => p.name === args.name)) {
        throw new UserInputError("Name must be unique", {
          invalidArgs: args.name,
        });
      }
      const person = { ...args, id: uuid() };
      persons.push(person); //update database with new person
      return person;
    },
  },
  Person: {
    address: (root) => {
      return {
        street: root.street,
        city: root.city,
      };
    },
  },
  // Person: {
  //   address: (root) => `${root.street}, ${root.city}`,
  //   check: () => "Pablinho",
  // },
};
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => console.log("Server ready at ", url));
