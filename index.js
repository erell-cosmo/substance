const debug = require('debug')('substance');

const csv = require('@fast-csv/format');

const lotusLib = require('./lotus');
const pubchemLib = require('./pubchem');

async function main(plantName) {
  debug(`Input plant name: "${plantName}"`)
  try {
    const compounds = await lotusLib.fetchCompounds(plantName);
    const compoundsProperties = await pubchemLib.fetchCompoundsProperties(compounds);
    const csvOptions = {
      headers: true
    };

    csv.write(compoundsProperties, csvOptions).pipe(process.stdout);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = main;
