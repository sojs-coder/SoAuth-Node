const fetch = require("node-fetch");

async function postData(data = {}) {
  const url = "https://soauth.sojs.repl.co/checkValid"
  const response = await fetch(url, {
    method: 'POST',
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*"
    },
    body: JSON.stringify(data)
  });
  
  return response.json()
}
function soauth(req,res,next){
  if(!req.session){
    console.log("Please install a session manager");
  }
  if(!req.session.so_auth){
    req.session.so_auth = {}
  }
  
  if(!req.cookies){
    console.log("Please install a cookie parser middleware")
  }else{
    if(req.cookies["so-auth"]){
      postData({"token":req.cookies["so-auth"]}).then(d=>{
        if(d.message){ console.log(d.message); req.session.so_auth.user = false; next()}else{
          req.session.so_auth.user = d;
          next(d)
        }
      })
    }else{
      next(false);
    }
  }
}
module.exports = {
  soauth
}