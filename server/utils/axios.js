const axios = require('axios');

const axiosClient = axios.create({
    baseURL:"",
    withCredentials:true
})

axiosClient.interceptors.response.use(
    response => response,
    
    async (error) => {
        console.error("Axios Error:", error);
        const config =  error.config;
        if(!config.retryCount) config.retryCount = 0;

        if (error.response) {
            const status = error.response.status;

            if (status === 401) {
                store.dispatch(logout());
            } else if (status === 403 && config.retryCount < 2) {
                try {
                    const { data } = await axios.get("/Api/User/Auth/rotateTokens");
                    if (data.success) {
                        config.retryCount += 1;
                        console.warn(`Retrying request (${config.retryCount})`);
                        return axiosClient(config); 

                    }
                } catch (error) {
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
module.exports = axiosClient;