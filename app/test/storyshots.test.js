import initStoryshots { multiSnapshotWithOptions } from '@storybook/addon-storyshots';
import path from 'path';

initStoryshots({
  /* configuration options */
  framework: 'react',
  // Ignore integrityOptions for async.storyshot because only run when asyncJest is true
  integrityOptions: { cwd: __dirname, ignore: ['**/**.async.storyshot'] },
  configPath: path.join(__dirname, '..', '.storybook'),
  test: multiSnapshotWithOptions(),
 });
