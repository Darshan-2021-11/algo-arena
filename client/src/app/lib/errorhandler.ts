import axios from "axios";
import { logout } from "./slices/authSlice";
import { setError } from "./slices/popupSlice";
import { store } from "./store";

export const errorhandler = async (func: Function, ...args: any[]) => {
    try {
        await func(...args);
    } catch (error: any) {
        console.log(error);
        if (error.status === 403 || error.status === 406) {
            try {
                const { data } = await axios.get("/Api/User/Auth/rotateTokens");
                if (data.success) {
                    await func(...args);
                    return;
                }
            } catch (error) {
                console.log(error)
                return store.dispatch(logout());
            }

        }
        if (error.status === 401) {
            return store.dispatch(logout());
        }

        if (error.message) {
            return store.dispatch(setError(error.message));
        }

        if (error.response?.data?.message) {
            return store.dispatch(setError(error.response.data.message));
        }

        store.dispatch(setError("Something went wrong."));
    }
};