const {program} = require('commander');
const main = require('./index');

program
  .description('List compounds properties from an input plant name.')
  .argument('<string>', 'plant name')
  .action(async (plantName) => {
    return await main(plantName);
  });

program.parse();