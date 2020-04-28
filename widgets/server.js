var express = require('express');
var graphqlHTTP = require('express-graphql');
var {graphql, buildSchema } = require('graphql');

// Initialize a GraphQL schema

const schema = buildSchema(`
    type Query {
       Widget(id: Int!): Widget
       widgets: [Widget]
    }

    type Mutation {
        createWidget(wBdy: String): Widget
    }

    type Widget {
        id: Int
        wBdy: String
        comments: [Comment]
    }

    type Comment {
        text: Int,
        user: String
    }
`)

let id = 2;

class Widget {
    constructor(widget){
        Object.assign(this, widget);
        this.id = id++;
    }

    async comments(){
        return new Promise((resolve) => {
            resolve([{
                text: Math.floor(Math.random() * 100),
                user: 'bob'
            }])
        }, 1000)
    }
}

const Owidgets = [
    {
        id: 1,
        wBdy: "WIdget 1",
    }
]

// Root resolver

var root = { 
    Widget: ({ id  }) => {
        return new Widget(Owidgets.find(rwidgets => rwidgets.id === id));
    },
    widgets: () => {
        return Owidgets.map(widget => new Widget(widget));
    },
    createWidget: ({wBdy}) => {
        const widget = new Widget({ wBdy });
        Owidgets.push(widget);
        return widget;
    }
}

// Create an express server and a GraphQL endpoint

var app = express();

app.use('/graphql', graphqlHTTP({
  schema: schema,  // Must be provided
  rootValue: root,
  graphiql: true,  // Enable GraphiQL when server endpoint is accessed in browser
}));

app.listen(3002, () => console.log('listeniing on 3002'));