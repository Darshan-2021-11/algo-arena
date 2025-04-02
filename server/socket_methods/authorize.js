const { users } = require("../data_models");

function authorize(){
    try {
        const user = users.get(this.id);
        if(!user){
            this.emit("server_report", { status: 5, message: "Unauthorized access." });
            return false;
        }
        return true;
    } catch (error) {
        console.log(error);
        this.emit("server_report", { status: 5, message: "Unauthorized access." });
        return false;
    }
   
}

module.exports = authorize;