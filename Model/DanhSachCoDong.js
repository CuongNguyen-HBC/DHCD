const mssql = require('mssql')
const Model = require('./Model')
class DanhSachCoDong extends Model{
    constructor(){
        super()
        this.table = 'DanhSachCoDong'
    }
    async getMaCoDong(barcode){
        const connect = await this.pool.connect()
        const request = await connect.request()
        request.input('barcode',mssql.NVarChar(200),barcode)
        const result = await request.query(`SELECT * FROM ${this.table} where ID=@barcode and Status = 0`)
        return result.recordset
    }
    async getMaUyQuyen(barcode){
        const connect = await this.pool.connect()
        const request = await connect.request()
        request.input('barcode',mssql.NVarChar(200),barcode)
        const result = await request.query(`SELECT * FROM ${this.table} where UID=@barcode and Status = 0`)
        return result.recordset
    }
    async updateCoDong(macodong){
        const connect =  await this.pool.connect()
        const request = await connect.request()
        request.input('macodong',mssql.NVarChar(200),macodong)
        request.query("update DanhSachCoDong set Status = 1 where ID = @macodong")
    }
}
module.exports = DanhSachCoDong