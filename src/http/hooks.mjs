export default {
  onHttpRequest: () => {},
  onHttpRequestEnd: (ctx) => {
    ctx.response = {
      headers: {
        server: 'quan',
        'content-length': 'text/plain',
      },
      body: 'ok',
    };
  },
};
