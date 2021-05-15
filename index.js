// @ts-check
const path = require('path');
const fs = require('fs');
const table = require('markdown-table');
const markdownMagic = require('markdown-magic');
const npmtotal = require('npmtotal');
const { 'npm-stats': key } = require('./package.json');

const badgeStats = require('./stats.json');

if (!key) {
  throw new Error('Please add `npm-stats` to your package.json');
}

(async () => {
  const stats = await npmtotal(key, {
    startDate: '2012-12-12',
    exclude: [
      'eslint-plugin-babel',
      'precise-commits',
      'typescript-eslint',
      'eslint-config-babel',
      'eslint-plugin-codelyzer',
      'typescript-pro-library-project',
      '@jameshenry/nx-project-graph',
      '@jameshenry/eslint-plugin-angular-template',
      '@jameshenry/eslint-plugin-codelyzer',
      '@jameshenry/angular-template-parser',
      '@jameshenry/eslint-builder',
    ],
  });

  const sortedStats = stats.stats.map((package) => {
    const [name, count] = package;
    return [`[${name}](https://www.npmjs.com/package/${name})`, count];
  });

  badgeStats.message = `${stats.sum} Downloads`;

  await fs.writeFileSync('./stats.json', JSON.stringify(badgeStats, null, 2));

  generate(sortedStats, stats.sum);
})();

function generate(data, sum) {
  const config = {
    transforms: {
      PACKAGES() {
        return table([
          ['Name', 'Downloads'],
          ...data,
          ['**Sum**', `**${sum}**`],
        ]);
      },
    },
  };

  markdownMagic(path.join(__dirname, 'README.md'), config, (d) => {
    console.log(`Updated total downloads - ${sum}`);
  });
}
