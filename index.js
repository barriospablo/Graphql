import { ApolloServer, UserInputError, gql } from "apollo-server";
import { v1 as uuid } from "uuid";
import axios from "axios";

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
    street: "Calle nombre",
    city: "Barranqueras",
    id: "3",
  },
];

const typeDefs = gql`
  enum YesNo {
    YES
    NO
  }

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
    allPersons(phone: YesNo): [Person]!
    findPerson(name: String!): Person
  }

  type Mutation {
    addPerson(
      name: String!
      phone: String
      street: String!
      city: String!
    ): Person
    editNumber(name: String!, phone: String!): Person
  }
`;
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons: async (root, args) => {
      const { data: personsfromrest } = await axios.get(
        "http://localhost:3000/persons"
      );
      console.log(personsfromrest);

      if (!args.phone) return personsfromrest;
      const byPhone = (person) =>
        args.phone === "YES" ? person.phone : !person.phone;
      return personsfromrest.filter(byPhone);
    },
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
    editNumber: (root, args) => {
      const personIndex = persons.findIndex((p) => p.name === args.name);
      if (personIndex === -1) return null;

      const person = persons[personIndex];

      const updatePerson = { ...person, phone: args.phone };
      persons[personIndex] = updatePerson;
      return updatePerson;
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
