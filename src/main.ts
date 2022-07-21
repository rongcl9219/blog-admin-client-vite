import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router';
import store from '@/store';
import * as Core from '@/core/utils';
import '@/global/UIComponents';
import globalComponents from '@/global/components';
import globalDirectives from '@/global/directives';
import globalMixins from '@/global/mixins';
import 'virtual:svg-icons-register';

const app = createApp(App);

Core.component(app, globalComponents);
Core.directive(app, globalDirectives);
Core.mixin(app, globalMixins);

app.use(store).use(router).mount('#app');
