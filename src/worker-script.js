export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // Attempt to fetch the asset from the local assets directory
    let response = await env.ASSETS.fetch(request);
    
    // If the asset isn't found (404) and the path doesn't look like a file (no dots),
    // we serve index.html to support SPA routing (like /login).
    if (response.status === 404 && !url.pathname.includes('.')) {
      return env.ASSETS.fetch(new URL('/index.html', url.origin));
    }
    
    return response;
  },
};
