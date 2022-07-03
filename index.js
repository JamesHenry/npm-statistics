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
      'angular-eslint',
      'nx-print-affected',

      /**
       * Whilst I am at the time of writing the lead maintainer of lerna on behalf of Nrwl,
       * I do not want to include the lerna stats as I did not create the project, nor work
       * on it at all for most of its existence.
       */
      'lerna',
      '@lerna/project',
      '@lerna/publish',
      '@lerna/command',
      '@lerna/package-graph',
      '@lerna/bootstrap',
      '@lerna/changed',
      '@lerna/add',
      '@lerna/collect-updates',
      '@lerna/list',
      '@lerna/run',
      '@lerna/create',
      '@lerna/exec',
      '@lerna/import',
      '@lerna/clean',
      '@lerna/version',
      '@lerna/package',
      '@lerna/link',
      '@lerna/diff',
      '@lerna/init',
      '@lerna/child-process',
      '@lerna/filter-options',
      '@lerna/conventional-commits',
      '@lerna/validation-error',
      '@lerna/filter-packages',
      '@lerna/npm-publish',
      '@lerna/npm-dist-tag',
      '@lerna/npm-install',
      '@lerna/symlink-dependencies',
      '@lerna/describe-ref',
      '@lerna/npm-run-script',
      '@lerna/symlink-binary',
      '@lerna/rimraf-dir',
      '@lerna/run-lifecycle',
      '@lerna/cli',
      '@lerna/create-symlink',
      '@lerna/listable',
      '@lerna/resolve-symlink',
      '@lerna/has-npm-version',
      '@lerna/prompt',
      '@lerna/check-working-tree',
      '@lerna/write-log-file',
      '@lerna/log-packed',
      '@lerna/get-npm-exec-opts',
      '@lerna/output',
      '@lerna/global-options',
      '@lerna/npm-conf',
      '@lerna/pack-directory',
      '@lerna/timer',
      '@lerna/get-packed',
      '@lerna/github-client',
      '@lerna/pulse-till-done',
      '@lerna/prerelease-id-from-version',
      '@lerna/query-graph',
      '@lerna/run-topologically',
      '@lerna/otplease',
      '@lerna/collect-uncommitted',
      '@lerna/gitlab-client',
      '@lerna/info',
      '@lerna/profiler',
      '@lerna/batch-packages',
      '@lerna/run-parallel-batches',
      '@lerna/temp-write',
      '@lerna/collect-packages',
      '@lerna/git-utils',
      '@lerna/fs-utils',
      '@lerna/has-dependency-installed',
      '@lerna/match-package-name',
      '@lerna/map-to-registry',
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
