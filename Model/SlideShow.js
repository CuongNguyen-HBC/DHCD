const mssql = require('mssql')
const Model = require('./Model')
class SlideShow extends Model{
    constructor(){
        super()
        this.table = 'SlideShow'
    }
    async SlideShow(){
        const connect = await this.pool.connect()
        const pool = await connect.request()
        const result = await pool.query(`SELECT * FROM ${this.table} order by Slide ASC`)
        return result.recordset
    }
    async MCScript(){
        const connect = await this.pool.connect()
        const pool = await connect.request()
        const result = await pool.query(`SELECT * FROM ${this.table} order by Slide ASC`)
        return result.recordset
    }
}
module.exports = SlideShow