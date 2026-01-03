export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const response = await env.ASSETS.fetch(request);

    // If the asset is not found (404), return the index.html for SPA routing
    if (response.status === 404 && !url.pathname.includes('.')) {
      return env.ASSETS.fetch(new URL('/index.html', url.origin));
    }

    return response;
  },
};
