import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv'
import path from "path";

import { ApolloServer } from "@apollo/server"
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import { buildContext} from 'graphql-passport'

import passport from 'passport'
import session from 'express-session'
import connectMongo from 'connect-mongodb-session'


import mergedResolvers from './resolvers/index.js'
import mergedTypeDefs from "./typeDefs/index.js"
import { connectDB } from "./db/connectDB.js";
import { configurePassport } from "./passport/passport.config.js";

// import job from './cron.js';


dotenv.config();
configurePassport()

// job.start()

const __dirname = path.resolve()

const app = express();

const httpServer = http.createServer(app)

const MongoDBStore = connectMongo(session)

const store = new MongoDBStore({
    uri: process.env.MONGO_URI,
    collection: "sessions"
})

store.on("error", (err)=> console.log(err))

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: 1000*60*60*24*7,
        httpOnly: true,
    },
    store: store
}))
app.use(passport.initialize())
app.use(passport.session())

const server = new ApolloServer({
  typeDefs: mergedTypeDefs,
  resolvers: mergedResolvers,
  plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
})


await server.start()


app.use(
    '/graphql',
    cors({
        origin:"http://localhost:3000",
        credentials: true
    }  
    ),
    express.json(),
   
    expressMiddleware(server, {
      context: async ({ req,res }) => buildContext({ req, res }),
    }),
  );
  
  //npm run build to get optimized version of the app
  app.use(express.static(path.join(__dirname, "frontend/dist")));

  app.get("*", (req, res)=>{
    res.sendFile(path.join(__dirname, "frontend/dist", "index.html"))
  })

  await new Promise((resolve) =>
    httpServer.listen({ port: 4000 }, resolve),
  );

  await connectDB()

  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
 
