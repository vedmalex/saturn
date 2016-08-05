import Html from '../Html';
import _ from 'lodash';
import ReactDOM from 'react-dom/server';

export default ({ renderProps, client, store, req, res, component } )=> {

  const maybeRenderPage = () => {
    if (!_.some(store.getState().apollo.queries, 'loading')) {
      stopSubscription();
      res.status(200);

      global.navigator = {userAgent: req.headers['user-agent']};

      const html = (
        <Html assets={webpackIsomorphicTools.assets()}
          component={component} store={store} />
      );
      res.send('<!doctype html>\n' + ReactDOM.renderToStaticMarkup(html));
    }
  }

  // now wait for all queries in the store to go ready
  const stopSubscription = store.subscribe(maybeRenderPage);

  // render once, to initialize apollo queries
  ReactDOM.renderToString(component);

  // if the page has no queries, the store will never change
  maybeRenderPage();
};
