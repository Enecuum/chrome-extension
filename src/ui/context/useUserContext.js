import {useCallback, useContext} from "react";
import {UserContext} from "./UserContext";

export function useUserContext() {
    const {state, dispatch} = useContext(UserContext)

    const setUser = useCallback((user) => {
        dispatch({ name: 'SET_USER', user})
    }, [dispatch])

    return {
        ...state,
        setUser
    }
}