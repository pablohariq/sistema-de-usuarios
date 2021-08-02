const { resolveNaptr } = require('dns')
const fs = require('fs')
const http = require('http')
const {registrarUsuario, consultarUsuarios, validarUsuario} = require('./index')

http.createServer(async (req, res) => {
    if (req.url == "/" && req.method == "GET"){
        const html = fs.readFileSync("index.html", "utf-8")
        res.writeHead(200, {"Content-type": "text/html; encoding=utf-8"})
        res.end(html)
    }

    //POST registrar
    if (req.url.startsWith("/usuario") && req.method == 'POST'){
        let body = ""
        req.on("data", (chunk) => {
            body+=chunk
        })
        req.on("end", async () => {
            await registrarUsuario(JSON.parse(body))
            res.statusCode = 200
            res.end()
        })
    }

    //GET usuarios
    if (req.url.startsWith("/usuarios") && req.method == 'GET'){
        const usuarios = await consultarUsuarios()
        res.writeHead(200, {"Content-type": "application/json"})
        res.end(JSON.stringify(usuarios))
    }

    //POST validar
    if (req.url.startsWith("/login") && req.method == "POST"){
        let body = ""
        req.on("data", (chunk) => {
            body+=chunk
        })
        req.on("end", async () => {
            try {
                await validarUsuario(JSON.parse(body))
                res.statusCode = 200
                res.end()
            } catch (error) {
                console.log("no validado")
                res.statusCode = 404
                res.end()
            }

        })
    }

})
.listen(3000, ()=> console.log("Servidor iniciado en el puerto 3000"))