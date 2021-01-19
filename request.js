'use strict';

import https from 'https';

const doRequest = async ({ hostname, path }) => {
  let options = {
    port: 443,
    method: 'GET',
    path: path,
    hostname: hostname
  }

  let data = '';

  return new Promise((resolve, reject) => {
    const req = https.request(options, res => {

      /*
      * europarl.europa.eu redirect all details MEP urls to another format, so we have to handle the 301 redirections.
      * We could have use a third party library like express to do so, but I prefered to stick to libraries (or built in) given in the README.md  
      */
      if (res.statusCode == 301) return doRequest({ hostname, path: res && res.headers && res.headers.location }).then(resolve).catch(reject);

      res.setEncoding('utf8');
      let responseBody = '';

      res.on('data', (chunk) => { responseBody += chunk });

      res.on('end', () => {
        return resolve(responseBody);
      });
    });

    req.on('error', err => reject(err));

    req.write(data);
    req.end();
  });
}

export { doRequest };