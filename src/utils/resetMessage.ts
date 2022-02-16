import { ElMessage } from 'element-plus';

let messageInstance: any = null;
const Message: any = (options: any) => {
    if (messageInstance) {
        messageInstance.close();
    }
    messageInstance = ElMessage(options);
};

['error', 'success', 'info', 'warning'].map((type: string) => {
    Message[type] = (options: string | GIObject) => {
        let opt: object = {
            type
        };

        if (typeof options === 'string') {
            opt = {
                message: options
            };
        } else {
            opt = Object.assign({}, opt, options);
        }
        return Message(opt);
    };
});

export default Message;
