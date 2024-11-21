const axios = require('axios');
const _ = require('lodash');

const LOTUS_API_BASE_URL = 'https://lotus.naturalproducts.net';
const LOTUS_API_SEARCH_URL = '/api/search/simple';

const PUBCHEM_API_BASE_URL = 'https://pubchem.ncbi.nlm.nih.gov';
const PUBCHEM_API_SEARCH_URL = '/rest/pug/compound';

async function fetchExactMasses(compounds) {
  const body = new URLSearchParams({
    InChIKey: compounds.slice(0,2).join(',')
  });
  const {data} = await axios.get(
    `${PUBCHEM_API_SEARCH_URL}/InChIKey/${compounds.join(',')}/property/InChIKey,CanonicalSMILES,ExactMass/JSON`,
    {
      baseURL: PUBCHEM_API_BASE_URL,
    }
  );

  return data.PropertyTable.Properties;
}

async function fetchCompounds(plantName) {
  const {data} = await axios.get(
    LOTUS_API_SEARCH_URL,
    {
      baseURL: LOTUS_API_BASE_URL,
      params: {
        query: plantName
      }
    }
  );

  return data.naturalProducts.map(compound => compound.inchikey);
}

async function main(plantName) {
  const compounds = await fetchCompounds(plantName);
  const exactMasses = await fetchExactMasses(compounds);

  console.log(exactMasses);
}

main('quercetin');