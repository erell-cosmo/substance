const axios = require('axios');
const _ = require('lodash');
const debug = require('debug')('substance:lotus');

const LOTUS_API_BASE_URL = 'https://lotus.naturalproducts.net';
const LOTUS_API_SEARCH_URL = '/api/search/simple';

function buildLotusCompound(rawCompound) {
  return {
    class: rawCompound.chemicalTaxonomyNPclassifierClass,
    inchikey: rawCompound.inchikey,
    name: rawCompound.traditional_name,
    superClass: rawCompound.chemicalTaxonomyNPclassifierSuperclass
  };
}

async function fetchCompounds(plantName) {
  debug(`Fetch compounds for plant name "${plantName}"`);
  const {data} = await axios.get(
    LOTUS_API_SEARCH_URL,
    {
      baseURL: LOTUS_API_BASE_URL,
      params: {
        query: plantName
      },
      timeout: 20000
    }
  );
  const compounds = data.naturalProducts.map(compound => buildLotusCompound(compound));

  debug('Compounds fetched:', compounds.length);
  return compounds;
}

module.exports = {
  fetchCompounds
};
