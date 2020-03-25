
const mssql = require('mssql')
const Model = require('./Model')
class Users extends Model{
    constructor(){
        super()
        this.table = 'Users'
    }
    async Login(username,password){
        const connect = await this.pool.connect()
        const pool = await connect.request()
        pool.input('username',mssql.VarChar(200),username)
        pool.input('password',mssql.NVarChar(200),password)
        const reusult = await pool.query(`SELECT * FROM ${this.table} where username=@username and password=@password`)
    
        if(reusult.rowsAffected[0] >0)
        return true
        else return false
    }
}

module.exports =  Users