const knex = require("../database/connection");
const User = require('./User');

class PasswordToken {

  async create(email) {
    let user = await User.findByEmail(email);
    
    if(user != undefined) {
        let token = Date.now();

        await knex
          .insert({
            token: token,
            used: 0,
            user_id: user.id,
          })
          .table("passwordtokens");
        return { status: true, msg: "Token gerado", token: token };
      } else {
        return { status: false, msg: "email nao achado"};
      }
  
  } 
  async validate(token) {
    try {
      let result = await knex.select(["id","user_id","used"]).where({token: token}).table("passwordtokens");
      
      if(result.length >= 0) {
        
        let tk = result[0];

        if(tk.used == 1) {
          return {status: false};
        } else {
          return {status: true, token: tk};
        }
      } else {
        return {status: false};
      }
    } catch(err) {
      console.log(err)
      return {status: false}
    }
  }
  async chooseUsed(token) {
    await knex.update({used: 1}).where({token: token}).table("passwordtokens");
  }
}

module.exports = new PasswordToken();