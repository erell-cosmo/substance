const axios = require('axios');
const _ = require('lodash');
const debug = require('debug')('substance:pubchem');

const PUBCHEM_API_BASE_URL = 'https://pubchem.ncbi.nlm.nih.gov';
const PUBCHEM_API_SEARCH_URL = '/rest/pug/compound';
const CHUNK_SIZE = 10;

async function wait(durationInSeconds) {
  return new Promise(resolve => {
    setTimeout(
      () => {
        resolve();
      },
      durationInSeconds * 1000
    );
  });
}

async function fetchChunkCompoundsProperties(compoundsChunk) {
  const inchiKeyList = _.map(compoundsChunk, 'inchikey').join(',');
  const {data} = await axios.get(
    `${PUBCHEM_API_SEARCH_URL}/InChIKey/${inchiKeyList}/property/CanonicalSMILES,ExactMass/JSON`,
    {
      baseURL: PUBCHEM_API_BASE_URL,
      timeout: 20000
    }
  );

  return data.PropertyTable.Properties;
}

async function fetchCompoundsProperties(compounds) {
  debug('Compounds by full chunk:', CHUNK_SIZE);
  const chunks = _.chunk(compounds, CHUNK_SIZE);
  const chunksCount = chunks.length;

  debug('Number of chunks:', chunksCount);
  const results = [];

  let chunkNumber = 1;
  for (const chunk of chunks) {
    debug(`Fetch chunk ${chunkNumber} / ${chunksCount}`);

    const [chunkResults] = await Promise.all([
      fetchChunkCompoundsProperties(chunk),
      wait(1)
    ]);

    results.push(...chunkResults);
    chunkNumber += 1;
  }
  return results;
}

module.exports = {
  fetchCompoundsProperties
};
