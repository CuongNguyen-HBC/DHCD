const mssql = require('mssql')
const Model = require('./Model')
class UngVienBauCu extends Model{
    constructor(){
        super()
        this.table = 'UngVienBauCu'
    }
  async listUngVien(){
      const connect = await this.pool.connect()
      const pool = await connect.request()
      const reuslt = await pool.query(`SELECT * FROM ${this.table} order by id`)
      return reuslt.recordset
  }
  async countUngVien(){
      const connect = await this.pool.connect()
      const pool = await connect.request()
      const result = await pool.query(`SELECT count(*) as 'sl' from ${this.table}`)
      const {sl} = result.recordset[0]
      return sl
  }
  async UngVien(id){
      const connect = await this.pool.connect()
      const pool = await connect.request()
      .input('id',mssql.Int,id)
      const result = await pool.query(`SELECT * FROM ${this.table} where id = @id`)
      return result.recordset[0]
  }
}
module.exports = UngVienBauCu