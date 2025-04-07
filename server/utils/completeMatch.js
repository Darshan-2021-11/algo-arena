const { default: axios } = require("axios");

async function completeMatch(user1, result, user2, duelid, code, lang, token){
    try {
        const url = "http://localhost:3000/Api/Duel/End";
        const headers = {
            headers: {
                Cookie: `token=${token}`,
            },
        }
        const {data} = await axios.post(url,{user1, result, user2, duelid, code, lang},headers);    
        console.log(data)
      
    } catch (error) {
        console.log(error);
    }
}

module.exports = completeMatch;