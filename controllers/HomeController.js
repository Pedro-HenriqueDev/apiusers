class HomeController{

    async index(req, res){
        res.send("APP EXPRESS! - Guia do programador");
    }
    async validate(req, res){
        res.status(200)
        res.send('Autenticado!');
    }

}

module.exports = new HomeController();