const mssql = require('mssql')
class Model {
    constructor(){
        this.pool = new mssql.ConnectionPool({
            user:process.env.DB_USER || 'sa',
            password:process.env.DB_PASSWORD || '*hbc123',
            server:process.env.DB_HOST || '192.168.3.4',
            port:parseInt(process.env.DB_PORT,10) || 8500,
            database:process.env.DB_NAME || 'QuanLyNoiBo' ,
            options:{
                "encrypt": false,
                "enableArithAbort": false,
                useUTC : true
            }
        })
        this.pool.connect('error', (errors) => {
            console.log(errors)
        })
    }
}
module.exports = Model