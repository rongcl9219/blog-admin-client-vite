import Viewer from 'viewerjs';
import { viewerDefaultOptions } from '@/components/ViewerImg/config';
import 'viewerjs/dist/viewer.css';

const newViewer = (el: HTMLElement, options?: object) => {
    const viewerOptions = Object.assign({}, viewerDefaultOptions, options || {});

    return new Viewer(el, viewerOptions);
};

export default newViewer;
