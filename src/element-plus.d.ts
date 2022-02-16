import { ElLoading, ElMessageBox, ElNotification } from 'element-plus';
import resetMessage from '@/utils/resetMessage';

declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $msg: typeof resetMessage;
        $loading: ElLoading;
        $confirm: ElMessageBox.confirm;
        $notify: ElNotification;
    }
}
