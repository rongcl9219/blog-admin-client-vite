import { ElLoading, ElMessageBox, ElNotification } from 'element-plus';
import myMessage from '@/utils/myMessage';

declare module '@vue/runtime-core' {
    export interface ComponentCustomProperties {
        $msg: typeof myMessage;
        $loading: typeof ElLoading;
        $confirm: typeof ElMessageBox.confirm;
        $notify: typeof ElNotification;
    }
}
