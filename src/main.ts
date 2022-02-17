import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router';
import store from '@/store';
import myMessage from '@/utils/myMessage';
import * as Core from '@/core/utils';
import '@/global/UIComponents';
import globalComponents from '@/global/components';
import globalDirectives from '@/global/directives';
import globalMixins from '@/global/mixins';
import 'virtual:svg-icons-register';

const app = createApp(App);

import { ElLoading, ElMessageBox, ElNotification } from 'element-plus';
app.config.globalProperties.$msg = myMessage;
app.config.globalProperties.$loading = ElLoading.service;
app.config.globalProperties.$confirm = ElMessageBox.confirm;
app.config.globalProperties.$notify = ElNotification;

Core.component(app, globalComponents);
Core.directive(app, globalDirectives);
Core.mixin(app, globalMixins);

app.use(store).use(router).mount('#app');
