const mssql = require('mssql')
const Model = require('./Model')
class BieuQuyetCauHoi extends Model {
    constructor() {
        super()
        this.table = 'BieuQuyetCauHoi'
    }
    async listKhongTanThanh(id) {
        const connect = await this.pool.connect()
        const pool = await connect.request()
        const result = await pool.query(`SELECT a.stt,b.Ma_Dai_Bieu, b.Ten_Dai_Bieu FROM ${this.table} a , DanhSachDaiBieu b where BieuQuyet = 0 and CauHoi = ${id} and a.Ma_Dai_Bieu = b.Ma_Dai_Bieu order by a.stt DESC`)
        return result.recordset
    }
    async listTanThanh(id) {
        const connect = await this.pool.connect()
        const pool = await connect.request()
        const result = await pool.query(`SELECT a.stt,b.Ma_Dai_Bieu, b.Ten_Dai_Bieu FROM ${this.table} a , DanhSachDaiBieu b where BieuQuyet = 1 and CauHoi = ${id} and a.Ma_Dai_Bieu = b.Ma_Dai_Bieu order by a.stt DESC`)
        return result.recordset
    }
    async listKhongHopLe(id) {
        const connect = await this.pool.connect()
        const pool = await connect.request()
        const result = await pool.query(`SELECT a.stt,b.Ma_Dai_Bieu, b.Ten_Dai_Bieu FROM ${this.table} a , DanhSachDaiBieu b where BieuQuyet = 3 and CauHoi = ${id} and a.Ma_Dai_Bieu = b.Ma_Dai_Bieu order by a.stt DESC`)
        return result.recordset
    }
}
module.exports = BieuQuyetCauHoi