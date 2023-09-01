// const { createProxyMiddleware } = require("http-proxy-middleware");

// module.exports = function (app) {
//   app.use(
//     "/api",
//     createProxyMiddleware({
//       target: "https://openapi.naver.com",
//       changeOrigin: true,
//       pathRewrite: {
//         "^/api": "/", // `/api`로 시작하는 경로를 `/`로 재작성
//       },
//     })
//   );
// };
