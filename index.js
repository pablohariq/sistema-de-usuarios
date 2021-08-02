const {Pool} = require('pg')

const config = {
    user: "postgres",
    password: "postgres",
    host: "localhost",
    port: 5432,
    database: "softlife",
    idleTimeoutMillis: 10000
}

const pool = new Pool(config)

const registrarUsuario = async (objDatos) => { //datosUsuario: []
    pool.connect(async (error_conexion, client, release) => {
        if (error_conexion) return console.log("Error de conexion.",error_conexion)
        const datosUsuario = Object.values(objDatos)
        try {
            const insercion = await client.query(`INSERT INTO usuarios(email, password) VALUES ($1, $2) RETURNING *;`, datosUsuario)
            const mensaje = `Usuario ${insercion.rows[0].email} registrado exitosamente!`
            console.log(mensaje)
        } catch (error_consulta) {
            console.log(error_consulta)
        }
        release()
    })
}

const consultarUsuarios = async () => {
    return new Promise((resolve, reject) => {
        pool.connect(async (error_conexion, client, release) => {
            if (error_conexion) reject("Error de conexión: ")
            try {
                const {rows: usuarios} = await client.query("SELECT * FROM usuarios;")
                resolve(usuarios)
            } catch (error_consulta) {
                console.log("Error en la consulta: ", error_consulta)
                reject(error_consulta)
            }
            release()
        })
    })
}

const validarUsuario = async (objUsuario) => {
    return new Promise((resolve, reject) => {
        pool.connect(async (error_conexion, client, release) => {
            if (error_conexion) reject("Error de conexión")
            try {
                const datosUsuario = Object.values(objUsuario)
                const usuarioValidado = await client.query(`SELECT * FROM usuarios WHERE email = $1 AND password = $2`, datosUsuario)
                console.log(usuarioValidado)
                if (usuarioValidado.rowCount != 0){
                    console.log("usuario validado")
                    resolve(usuarioValidado)
                }
                else{
                    throw("Usuario no encontrado")
                }
                    
            } catch (error_consulta) {
                reject(error_consulta)
            }
            release()
        })
    })

}

module.exports = {registrarUsuario, consultarUsuarios, validarUsuario}