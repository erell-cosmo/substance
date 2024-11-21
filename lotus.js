const axios = require('axios');
const _ = require('lodash');
const debug = require('debug')('substance:lotus');

const LOTUS_API_BASE_URL = 'https://lotus.naturalproducts.net';
const LOTUS_API_SEARCH_URL = '/api/search/simple';

async function fetchCompounds(plantName) {
  debug(`Fetch compounds for plant name "${plantName}"`);
  const {data} = await axios.get(
    LOTUS_API_SEARCH_URL,
    {
      baseURL: LOTUS_API_BASE_URL,
      params: {
        query: plantName
      },
      timeout: 3000
    }
  );
  const compounds = data.naturalProducts.map(compound => compound.inchikey);

  debug('Compounds fetched:', compounds.length);
  return compounds;
}

module.exports = {
  fetchCompounds
};