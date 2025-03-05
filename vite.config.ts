// vite.config.js

export default {
    server: {
      hmr: {
        protocol: 'ws',  // ws (WebSocket) kullanmayı tercih edebiliriz
        host: 'localhost'