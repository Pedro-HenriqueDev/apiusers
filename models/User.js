const knex = require("../database/connection");
const PasswordToken = require("./PasswordToken");
const bcrypt = require("bcrypt");

class User {
  async findAll() {
    try {
      let users = await knex
        .select(["id", "name", "email", "role"])
        .table("users");
      return users;
    } catch (err) {
      return [];
    }
  }

  async findById(id) {
    try {
      let user = await knex
        .select(["id", "name", "email", "role"])
        .where({ id: id })
        .table("users");

      if (user.length >= 0) {
        return user[0];
      }
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }

  async new(email, password, name) {
    try {
      let hash = await bcrypt.hash(password, 10);

      await knex
        .insert({ email: email, password: hash, name: name, role: 0 })
        .table("users");
        return {status: 200, msg: "OK!"}
    } catch (err) {
      return {status: 406 ,msg: "Houve um erro!"}
    }
  }
  async findByEmail(email) {
    try {
      let result = await knex
        .select(["id", "name","password", "email", "role"])
        .where({ email: email })
        .table("users");

      return result[0];
    } catch (err) {
      console.log(err);
      return undefined;
    }
  }
  async update(id, name, role, email) {
    let editUser = {};
    let user = await this.findById(id);

    if (user != undefined) {

      if (email != undefined || email != "" || email != " ") {

        if (email != user.email) {

              let result = await this.findByEmail(email);
              if (result == undefined) {
                editUser.email = email;
              } else {
                return { status: false, err: "O email ja pertence a outra conta" };
              }

        }
      }
      if (name != undefined || name.length < 5) {
        editUser.name = name;
      }
      if (role != undefined) {
        editUser.role = role;
      }
      try {
        await knex.update(editUser).where({ id: id }).table("users");
        return { status: true, err: "OK"};
      } catch (err) {
        return { status: false, err: "Houve um erro" };
      }
    } else {
      return { status: false, err: "O usuario nao Existe!" };
    }
  }
  async delete(id) {
    let user = await this.findById(id);
    if (user == []) {
      return { status: 404, msg: "Usuario nao Encontrado" };
    } else {
      try {
        let result = await knex.delete().where({ id: id }).table("users");

        if (result == 0) {
          return { status: 404, msg: "Usuario nao Encontrado" };
        } else {
          return { status: 200, msg: "OK" };
        }
      } catch (err) {
        return { status: 406, msg: "Erro ao tentar excluit Usuario" };
      }
    }
  }
  async changePassword(newPassword, id, token) {
    try {
      let hash = await bcrypt.hash(newPassword, 10);
      await knex.update({ password: hash }).where({ id: id }).table("users");

      await PasswordToken.chooseUsed(token);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = new User();
