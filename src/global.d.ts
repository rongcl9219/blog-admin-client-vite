interface GIPagination {
    page: number;
    pageSize: number;
    total?: number;
}

interface GIObject {
    [key: string]: any;
}

interface RuleValidatorCallback {
    // eslint-disable-next-line no-unused-vars
    (message?: Error | string): any;
}

interface RuleValidator {
    // eslint-disable-next-line no-unused-vars
    (rule: any, value: any, callback: RuleValidatorCallback): RuleValidatorCallback;
}

interface RuleItem {
    required: boolean;
    message?: string;
    // eslint-disable-next-line no-unused-vars
    validator?: RuleValidator;
    trigger: string | string[];
}

interface FormRule {
    [key: string]: Array<RuleItem>;
}

interface GIDialogModel {
    dialogVisible: boolean;
    title?: string;
    isNew?: boolean;
    loading?: boolean;
    saveFlag?: boolean;
}
