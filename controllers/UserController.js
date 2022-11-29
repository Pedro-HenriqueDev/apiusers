const PasswordToken = require("../models/PasswordToken");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/User");
require('dotenv').config()

class UserController {

  async index(req, res) {
    let users = await User.findAll();
    res.json(users);
  }

  async getUserById(req, res) {
    let { id } = req.params;

    let user = await User.findById(id);
    if (user == undefined) {
      res.status(404);
      res.json({err: "Usuario nao encontrado"});
    } else {
      res.status(200);
      res.json(user);
    }
  }

  async create(req, res) {
    let { email, name, password } = req.body;

    if (email == undefined ||  email == '' || email == ' ') {
      res.status(400);
      res.json({ err: "Requisiçao invalida" });
      return;
    } else if (name == "" || name.length < 5) {
      res.status(400);
      res.json({ err: "Nome invalido!" });
      return;
    } else if (password == "" || password.length < 8) {
      res.status(400);
      res.json({ err: "Senha invalida" });
      return;
    } else {
      let emailExists = await User.findByEmail(email);

      if (emailExists == undefined) {
        
        let result = await User.new(email, password, name);
        res.status(result.status);
        res.json(result.msg);
        return;
      } else {
        res.status(400);
        res.json({ err: "O email ja existe" });
      }
    }
  }
  async edit(req, res) {
    let { id, name, role, email } = req.body;

    if(email == "" || email == " ") {
      res.status(404);
      res.send("Requisiçao invalida!");
    } else {
      let result = await User.update(id, name, role, email);

      if (result.status) {
        res.status(200);
        res.send(result.err);
      } else {
        res.status(404);
        res.send(result.err);
      }
    }
  }
  async delete(req, res) {
    let id = req.params.id;
    if (id == "" || id == " ") {
      res.status(400);
      res.json("Requisiçao invalida");
    } else {
      if (isNaN(id)) {
        res.status(400);
        res.json("Requisiçao invalida");
      } else {
        try {
          let result = await User.delete(id);

          res.status(result.status);
          res.json(result.msg);
        } catch (err) {
          res.status(406);
          res.json("Ocorreu um erro no servidor!");
          console.log(err);
        }
      }
    }
  }
  async recoveryPassword(req, res) {
    let email = req.body.email;
    try {
      let result = await PasswordToken.create(email);
      if (result.status) {
        console.log(result.token);
        res.status(200);
        res.json("SIMBORA");
      } else {
        res.status(406);
        res.json(result.msg);
      }
    } catch (err) {
      console.log(err);
    }
  }
  async changePassword(req, res) {
    let token = req.body.token;
    let password = req.body.password;

    let isTokenValidate = await PasswordToken.validate(token);

    if (isTokenValidate.status) {
      let idUser = await isTokenValidate.token.user_id;
      User.changePassword(password, idUser, isTokenValidate.token.token);

      res.status(200);
      res.json({ msg: "Senha alterada" });
    } else {
      res.status(406);
      res.json({ err: "Token invalido" });
    }
  }
  async login(req, res) {
    let { email, password } = req.body;
    let user = await User.findByEmail(email);

    if (user == undefined) {
      res.status(404);
      res.json({ err: "Usuario nao encontrado" });
    } else {
      let result = await bcrypt.compare(password, user.password);
      
      if(result) {
        let token = jwt.sign({email: user.email, role: user.role}, process.env.SECRET);

        res.status(200);
        res.json({token: token});
        
      } else {
        res.status(400)
        res.json({err: "Senha incorreta"})
      }
    }
  }
}

module.exports = new UserController();
