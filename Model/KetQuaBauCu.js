const mssql = require('mssql')
const Model = require('./Model')
class KetQuaBauCu extends Model{
    constructor(){
        super()
        this.table = 'KetQuaBauCu'
    }
    async checkTongPhieu(madaibieu){
        const connect = await this.pool.connect()
        const pool = await connect.request()
        .input('madaibieu',mssql.NVarChar(200),madaibieu)
        const result = await pool.query(`SELECT SUM(sophieubau) as 'TongPhieu' from ${this.table} where madaibieu=@madaibieu`)
        return result.recordset[0]
    }
    async insertKetQua(madaibieu,ungvien,sophieubau){
        const connect = await this.pool.connect()
        const pool = await connect.request()
        .input('madaibieu',mssql.NVarChar(200),madaibieu)
        .input('ungvien',mssql.Int,ungvien)
        .input('sophieubau',mssql.Int,sophieubau)
        .query(`INSERT INTO ${this.table}(maungvien,madaibieu,sophieubau) values(@ungvien,@madaibieu,@sophieubau)`)
    }
    async HuyKetQua(madaibieu){
        const connect = await this.pool.connect()
        const pool = await connect.request()
        .input('madaibieu',mssql.NVarChar(200),madaibieu)
        .query(`delete from ${this.table} where madaibieu = @madaibieu`)
    }
}
module.exports = KetQuaBauCu