const { createSSRApp } = require('vue')
const { renderToString } = require('@vue/server-renderer')

import App from "./App.vue"
import router from './router/index.ts';

const app = createSSRApp(App);

app.mixin({
  data: function () {
    return {
      PHP
    }
  }
})

app.use(router);

router.push(PHP.current_url || '/');

; (async () => {
  try {
    await router.isReady();

    const html = await renderToString(app)

    dispatch(html);
  } catch (e) {
    dispatch(e);
  }
})()