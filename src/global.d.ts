declare interface GIPagination {
    page: number;
    pageSize: number;
    total?: number;
}

declare interface GIObject {
    [key: string]: any;
}

declare interface RuleValidatorCallback {
    // eslint-disable-next-line no-unused-vars
    (message?: Error | string): any;
}

declare interface RuleValidator {
    // eslint-disable-next-line no-unused-vars
    (rule: any, value: any, callback: RuleValidatorCallback): RuleValidatorCallback;
}

declare interface RuleItem {
    required: boolean;
    message?: string;
    validator?: RuleValidator;
    trigger: string | string[];
}

declare interface FormRule {
    [key: string]: Array<RuleItem>;
}

declare interface GIDialogModel {
    dialogVisible: boolean;
    title?: string;
    isNew?: boolean;
    loading?: boolean;
    saveFlag?: boolean;
}

declare interface GIFileInfo {
    key: string;
    url: string;
}
