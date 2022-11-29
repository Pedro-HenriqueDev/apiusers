let bodyParser = require('body-parser')
let express = require("express")
let app = express()
let router = require("./routes/routes")
let cors = require("cors")
const port = process.env.PORT || 8686
app.use(cors());


app.use(bodyParser.urlencoded({ extended: false }))

app.use(bodyParser.json())

app.use("/",router);

app.listen(port,() => {
    console.log("Servidor rodando")
});
