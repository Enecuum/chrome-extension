export const userContextReducer = (state, action) => {
    switch (action.name) {
        case 'SET_USER':
            return {
                user: action.user
            }
        default:
            return state;
    }
}