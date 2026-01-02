// Dummy worker script to satisfy Wrangler requirements if necessary
export default {
  async fetch() {
    return new Response('Not Implemented', { status: 501 });
  },
};
