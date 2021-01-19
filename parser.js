import cheerio from 'cheerio';

import { getLastName } from './utils'; 

const parseLegislators = async (html) => {
  let $ = cheerio.load(html);

  let legislators = $('body')
    .find('.erpl_member-list-item')
    .map((i, el) => {
      let name = $(el).find('.t-item').text().trim();
      let lastName = getLastName(name);
      let url = $(el).find('a').attr('href');

      let infos = [];

      $(el)
        .find('div > div > div')
        .each((idx, elem) => {
          let text = $(elem).text().trim()
          infos.push(text);
        })

      let [partyGroup, country] = infos || [];

      return { name, lastName, url, partyGroup, country };
    }).get();

  return legislators;
}

const parseLegislator = async (html, options) => {
  // We need to have option on that one to build our picture full url
  let { hostname = '', protocol = 'https://' } = options || {};

  const $ = cheerio.load(html);

  let url = $('link[rel="canonical"]').attr('href');
  const image = $('body').find('.erpl_image-frame span img').attr('src');

  return { url, image: `${protocol}${hostname}${image}` };
}

export { parseLegislators, parseLegislator };