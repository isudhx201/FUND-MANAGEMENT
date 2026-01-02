// Dummy worker script to satisfy Wrangler requirements if necessary
export default {
  async fetch(request, env, ctx) {
    return new Response('Not Implemented', { status: 501 });
  },
};
