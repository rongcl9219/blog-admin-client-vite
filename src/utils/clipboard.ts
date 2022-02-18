import Clipboard from 'clipboard';
import myMessage from '@/utils/myMessage';

const clipboardSuccess = (): void => {
    myMessage({
        type: 'success',
        message: '复制成功',
        duration: 1500
    });
};

const clipboardError = (): void => {
    myMessage({
        type: 'error',
        message: '复制失败',
        duration: 1500
    });
};

const handleClipboard = (text: string, event: MouseEvent) => {
    const target = event.target as HTMLElement;
    const clipboard: any = new Clipboard(target, {
        text: () => text
    });
    clipboard.on('success', () => {
        clipboardSuccess();
        clipboard.destroy();
    });
    clipboard.on('error', () => {
        clipboardError();
        clipboard.destroy();
    });
    clipboard.onClick(event);
};

export default handleClipboard;
