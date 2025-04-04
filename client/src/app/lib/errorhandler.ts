// import store from "./store";
// import { setError, setMessage } from "./slices/popupSlice";

// export const errorhandler = async (func:Function,...args:any[]) => {
//     try {
//        const res = await func(...args);
//        if(!res.success){
//         store.dispatch(setError(res.error));
//        }
//        console.log(res)
     
//     } catch (error: any) {
//       console.table(error);
//       store.dispatch(setError(error.message || 'something went wrong'));
//     }
// };
