import Bridge from './bridge';

process.env.BRIDGES.split(',').forEach((ids) => {
  const bridge = new Bridge(...ids.split('::'));
});
