import {createContext, useReducer} from "react";
import {userContextReducer} from "./userContextReducer";

const defaultValue = {
    user: {}
}

export const UserContext = createContext(defaultValue)

const {Provider} = UserContext

export const UserProvider = ({children}) => {
    const [state, dispatch] = useReducer(userContextReducer, defaultValue)
    return <Provider value={{state, dispatch}}> {children} </Provider>
}