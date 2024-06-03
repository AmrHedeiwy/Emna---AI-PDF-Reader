import { createRouteHandler } from 'uploadthing/next';

import { ourFileRouter } from './core';

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter
});

export const maxDuration = 1000 * 60 * 5;
