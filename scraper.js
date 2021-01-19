'use strict';

import url from 'url';

import { doRequest } from './request';
import { parseLegislators, parseLegislator } from './parser';

const EUROPA_ENDPOINT = 'https://www.europarl.europa.eu/meps/en/full-list/all';

export const scrapeEULegislators = async () => {
  let legislators = [];

  /* 
  * We have to parse url cause some links from the scrapper are not always in "https"
  * I designed my "doRequest" function to "force" the https in options
  */

  let { hostname, path } = url.parse(EUROPA_ENDPOINT);

  let mainPage = await doRequest({ hostname, path });


  // First, we need to get main infos on the main page.
  legislators = await parseLegislators(mainPage);

  /* 
  * Unfortunately, we do not have access to the correct url & picture on the main page
  * We will have to loop on MEP details to get the remaining informations
  */

  for (let i = 0; i < legislators.length; i++) {
    let { url: legislatorsPage } = legislators[i];

    let { hostname, path } = url.parse(legislatorsPage);

    let legislatorPage = await doRequest({ hostname, path });

    let legislator = await parseLegislator(legislatorPage, { hostname, protocol: 'https://' });

    // Assign all the detailed informations (picture, new url) found on the MEP page to fill my legislator array
    legislators[i] = Object.assign(legislators[i], legislator);

    break; // For development purpose only
  }

  return legislators;
}
