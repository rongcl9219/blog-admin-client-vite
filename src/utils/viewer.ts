import { ref } from 'vue';
import Viewer from 'viewerjs';
import { viewerDefaultOptions } from '@/components/ViewerImg/config';
import 'viewerjs/dist/viewer.css';

const newViewer = (el: string, options?: object) => {
    const viewerObj = ref<any>();

    const updateViewer = () => {
        if (viewerObj.value) {
            viewerObj.value.update();
        } else {
            const eleDom = document.querySelectorAll(el)[0] as HTMLElement;
            if (!eleDom) {
                return;
            }
            const viewerOptions = Object.assign({}, viewerDefaultOptions, options || {});

            viewerObj.value = new Viewer(eleDom, viewerOptions);
        }
    };

    return {
        viewerObj,
        updateViewer
    };
};

export default newViewer;
