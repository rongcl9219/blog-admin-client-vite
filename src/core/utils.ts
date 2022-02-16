export const component = (app: any, components: Array<any>) => {
    components.forEach((componentItem) => {
        app.component(componentItem.name, componentItem);
    });
};

export const directive = (app: any, directives: any) => {
    Object.keys(directives).forEach((key) => {
        app.directive(key, directives[key]);
    });
};

export const mixin = (app: any, mixins: any) => {
    app.mixin(mixins);
};

export const plugin = (app: any, plugins: Array<any>) => {
    plugins.forEach((pluginItem) => {
        app.use(pluginItem[pluginItem.name], pluginItem.options || {});
    });
};
