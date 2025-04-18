# GraphQL API - People Agenda

This project exposes a GraphQL API built with `apollo-server`, which allows you to perform basic operations on a list of people. We define the schema, the resolvers, and start the server.

### Dependencies

The following packages are imported:

```js
import { ApolloServer, UserInputError, gql } from "apollo-server";
import { v1 as uuid } from "uuid";
```

---

### Mocked Data

A `persons` array with some sample data is used as an in-memory database.

```js
const persons = [
  { name: "Pablo", phone: "123", street: "Calle falsa", city: "Resistencia", id: "1" },
  ...
];
```

---

### GraphQL Schema (`typeDefs`)

The service schema is defined using `gql`. It includes:

#### Types:

- `Person`: Represents a person with a name, phone number, address, and ID.
- `Address`: Nested structure containing `street` and `city`.
- `YesNo`: Enum to filter people based on whether they have a phone number.

#### Queries

- `personCount`: Returns the total number of people.
- `allPersons(phone: YesNo)`: Lists all people, with the option to filter by whether they have a phone number.
- `findPerson(name: String!)`: Searches for a person by name.

#### Mutations

- `addPerson`: Adds a new person.
- `editNumber`: Updates the phone number of an existing person.

---

### Resolvers

Resolvers define how each query or mutation in the schema is responded to.

#### `Query`:

- `personCount`: Counts the total number of people.
- `allPersons`: Returns all or filters by phone number (YES or NO).
- `findPerson`: Searches by name.

#### `Mutation`:

- `addPerson`: Adds a person with unique name validation. Generates an ID with uuid().
- `editNumber`: Edits the phone number if the person exists.

#### Nested Field Resolver:

- `Person.address`: Compiles the `address` field from the `street` and `city` fields.

---

## Examples of Queries

```graphql
# Get all people
query {
  allPersons {
    name
    phone
    address {
      street
      city
    }
  }
}

# Add new person
mutation {
  addPerson(name: "Juan", phone: "555", street: "Main", city: "Madrid") {
    id
    name
  }
}
```

---

