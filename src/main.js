import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);


import * as Sentry from "@sentry/browser";
import {BrowserTracing} from "@sentry/tracing";

Sentry.init({
  dsn: "https://9dc2591849d5401dbc53ba77c2767ff6@o250184.ingest.sentry.io/4504659121209344",
  integrations: [new BrowserTracing()],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 0.5,
});
//https://hcs-z5.sentry.io/issues/?project=4504659121209344#welcome

//Vant
import Vant from 'vant';
import 'vant/lib/index.css';

Vue.use(Vant);

import db_util from "@/utils/db_util"

db_util.initDB().then(() => {
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
})



