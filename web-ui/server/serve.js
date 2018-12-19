const express = require('express');
const path = require('path');
const proxy = require('http-proxy-middleware');
const morgan = require('morgan');

const port = process.env.PORT || 5000;
const proxyLocation = process.env.PROXY || 'http://localhost:8080';
const staticFilesLocation = path.join(__dirname, '../build');
const indexLocation = path.join(staticFilesLocation, 'index.html');

// TODO: Change once SSL on deployed server is fixed (GBA-247)
const DANGEROUS_FORCE_SECURE_SSL = false;

const RESPONSE_STATUS_CODES_BELOW_400_TO_LOG = [201];
const LOG_FORMAT =
  '[:date[clf]] ' +
  'HTTP/:http-version ' +
  ':method ' +
  ':status ' +
  ':url ' +
  ':remote-addr ' +
  ':remote-user ' +
  ':res[content-length] ' +
  ':response-time ms ' +
  '\n:referrer ' +
  ':user-agent ' +
  '\n';

const app = express();

app.use(
  morgan(LOG_FORMAT, {
    skip: function(req, res) {
      return !(
        req.url.includes('/api') &&
        (res.statusCode >= 400 || RESPONSE_STATUS_CODES_BELOW_400_TO_LOG.includes(res.statusCode))
      );
    }
  })
);

app.use('/', express.static(staticFilesLocation));

app.use(
  '/api',
  proxy({
    target: proxyLocation,
    changeOrigin: true,
    secure: DANGEROUS_FORCE_SECURE_SSL
  })
);

app.all('*', (_, res) => res.sendFile(indexLocation));

app.listen(port, () => {
  console.log(`
=====================================
Web UI Server listening on port ${port}
=====================================
Serving files in ${staticFilesLocation}`);
});
