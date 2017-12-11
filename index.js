const express = require('express');
const graphqlHTTP = require('express-graphql');
const gql = require('graphql');
const TODOS = require('./data');

require('dotenv').config();

const app = express();

app.set('port', process.env.PORT || 7893);

const TodoType = new gql.GraphQLObjectType({
  name: 'TodoType',
  fields: {
    id: { type: gql.GraphQLID },
    text: { type: gql.GraphQLString },
    completed: { type: gql.GraphQLBoolean },
  },
});

const schema = new gql.GraphQLSchema({
  query: new gql.GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      allTodos: {
        type: new gql.GraphQLList(TodoType),
        description: 'A list of all a users todos',
        resolve() {
          return TODOS;
        },
      },
      todoById: {
        type: TodoType,
        args: {
          id: {
            type: new gql.GraphQLNonNull(gql.GraphQLID),
          },
        },
        resolve(_, { id }) {
          return TODOS.find(todo => todo.id === +id);
        },
      },
      isCompleted: {
        type: new gql.GraphQLList(TodoType),
        args: {
          completed: {
            type: new gql.GraphQLNonNull(gql.GraphQLBoolean),
          },
        },
        resolve(_, { completed }) {
          const result = TODOS.filter(todo => todo.completed === completed);
          return result;
        },
      },
    },
  }),
});

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(app.get('port'), () => {
  console.log(
    `Server is running at http://localhost:${app.get('port')}/graphql`
  );
});
