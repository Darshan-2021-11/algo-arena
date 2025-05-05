import axios from "@/app/lib/errorhandler";

const SignIn =async(email:string, password:string)=>{
    try {
        const response = await axios.post("/Api/Auth/Login", { email, password });
      if (response.status === 200) {
        localStorage.setItem("token", response.data.token); // Store token in localStorage or cookies
        alert("Login successful!");
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    } catch (error) {
        console.log(error);
    }
}

const SignUp =()=>{
    
}