export interface UserState {
    username?: string;
    avatar?: string;
}

export const getDefaultState = () => {
    const state: UserState = {
        username: '',
        avatar: ''
    };

    return state;
};

export const state = getDefaultState();
