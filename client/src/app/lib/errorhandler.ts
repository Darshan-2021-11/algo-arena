import axios from "axios";
import { logout } from "./slices/authSlice";
import { setError } from "./slices/popupSlice";
import { store } from "./store";

const axiosClient = axios.create({
    baseURL: "",
    withCredentials: true
});

axiosClient.interceptors.response.use(
    response => response,
    
    async (error) => {
        console.error("Axios Error:", error);
        const config =  error.config;
        if(!config.retryCount) config.retryCount = 0;

        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                try {
                    await axios.get("/Api/User/Auth/Logout");
                  } catch (error) {
                    console.log(error);
                  }finally{
                    store.dispatch(logout());
                  }
            } else if (status === 403 && config.retryCount < 2) {
                try {
                    const { data } = await axios.get("/Api/User/Auth/rotateTokens");
                    if (data.success) {
                        config.retryCount += 1;
                        console.warn(`Retrying request (${config.retryCount})`);
                        return axiosClient(config); 

                    }
                } catch (error: any) {
                    console.log(error)
                }
            } else if (status === 500) {
                store.dispatch(setError("Server error. Try again later."));
            } else {
                store.dispatch(setError(error.response.data?.message || "Something went wrong."));
            }
        } else {
            store.dispatch(setError("Network error. Please check your connection."));
        }

        return Promise.reject(error);
    }

)
export default axiosClient;

// export axiosClient;

// export const errorhandler = async (func: Function, ...args: any[]) => {
//     try {
//         await func(...args);
//     } catch (error: any) {
//         console.log(error);
//         if (error.status === 403 || error.status === 406) {
//             try {
//                 const { data } = await axios.get("/Api/User/Auth/rotateTokens");
//                 if (data.success) {
//                     await func(...args);
//                     return;
//                 }
//             } catch (error: any) {
//                 console.log(error)
//             }

//         }
//         if (error.status === 401) {
//             return store.dispatch(logout());
//         }

//         if (error.message) {
//             return store.dispatch(setError(error.message));
//         }

//         if (error.response?.data?.message) {
//             return store.dispatch(setError(error.response.data.message));
//         }

//         store.dispatch(setError("Something went wrong."));
//     }
// };