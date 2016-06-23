import webpack from 'webpack';
import webpackConfig from '../../webpack/prod.config';

export default clientFile => {
  webpackConfig.entry.main.push(clientFile);
  const compiler = webpack(webpackConfig);

  compiler.run((err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
    } else {
      console.log(stats.toString({
        colors: true,
        errorDetails: true,
        reasons: true,
        cached: true,
        cachedAssets: true,
        modules: true
      }));
    }
  });
};
