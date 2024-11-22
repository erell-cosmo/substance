const _ = require('lodash');
const debug = require('debug')('substance');

const csv = require('@fast-csv/format');

const lotusLib = require('./lotus');
const pubchemLib = require('./pubchem');

async function main(plantName) {
  debug(`Input plant name: "${plantName}"`)
  try {
    const compounds = await lotusLib.fetchCompounds(plantName);
    const compoundsProperties = await pubchemLib.fetchCompoundsProperties(compounds);
    const compoundsWithProperties = _.zipWith(
      compounds,
      compoundsProperties,
      (compound, compoundProperties) => Object.assign(
        {},
        compound,
        compoundProperties
      )
    );
    const csvOptions = {
      headers: [
        'superClass',
        'class',
        'name',
        'ExactMass',
        'CanonicalSMILES',
        'inchikey',
      ]
    };
    debug('Write csv to stdout')
    csv.write(compoundsWithProperties, csvOptions).pipe(process.stdout);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

module.exports = main;
