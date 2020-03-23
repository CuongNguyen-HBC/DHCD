const mssql = require('mssql')
const Model = require('./Model')
class ChiTietDaiBieu extends Model{
    constructor(){
        super()
        this.table = 'ChiTietDaiBieu'
    }
    async insertChiTiet(madaibieu,macodong){
            const connect = await this.pool.connect()
            const pool = await connect.request()
            pool.input('Ma_Dai_Bieu',mssql.NVarChar(200),madaibieu)
            pool.input('Ma_Co_Dong',mssql.NVarChar(200),macodong)
            pool.query(`insert into ${this.table}(Ma_Dai_Bieu,Ma_Co_Dong) values(@Ma_Dai_Bieu,@Ma_Co_Dong)`)
    }
}
module.exports = ChiTietDaiBieu