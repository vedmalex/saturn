import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { apolloServer } from 'apollo-server';
import bodyParser from 'body-parser';

const app = express();

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// XXX: is this app specific?
app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

import config from '../config';
app.start = () => {
  if (config.apiPort) {
    app.listen(config.apiPort, () => {
      console.info('----\n==> 🌎  GraphQL Server is running on port %s', config.apiPort);
      console.info('==> 💻  Send queries to http://%s:%s/graphql', config.apiHost, config.apiPort);
    });
  } else {
    console.error('==>     ERROR: No PORT environment variable has been specified');
  }
}

export default app;
