import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.css';

const viewerDefaultOptions: any = {
    toolbar: {
        zoomIn: false,
        zoomOut: false,
        oneToOne: false,
        reset: false,
        prev: 4,
        play: {
            show: false,
            size: 'large'
        },
        next: 4,
        rotateLeft: false,
        rotateRight: false,
        flipHorizontal: false,
        flipVertical: false
    },
    keyboard: false,
    movable: false,
    rotatable: false,
    initialViewIndex: 0
};

const newViewer = (el: HTMLElement, options?:object) => {
    const viewerOptions = Object.assign({}, viewerDefaultOptions, options || {});

    return new Viewer(el, viewerOptions);
};

export default newViewer;
