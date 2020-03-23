const mssql = require('mssql')
const Model = require('./Model')
class DanhSachCauHoi extends Model{
    constructor(){
        super()
        this.table = 'DanhSachCauHoi'
    }
    async listCauHoi(){
        const connect = await this.pool.connect()
        const pool = await connect.request()
        const result = await pool.query(`SELECT CONVERT(varchar,locked,20) as 'locked',CauHoi,NoiDungCauHoi,SoPhieuHienTai,Status,id,sodaibieu=(select count(*) from DanhSachDaiBieu) FROM ${this.table} order by id`)
        return result.recordset
    }
    async lockCauHoi(id){
        const connect = await this.pool.connect()
        const pool = await connect.request()
        pool.query(`SELECT SUM(TongCP) as 'sophieu' from DanhSachDaiBieu`).then(async res => {
            const sophieu = res.recordset[0].sophieu
            const pool2 = await this.pool.connect()
            console.log(sophieu,id)
            pool2.query(`UPDATE DanhSachCauHoi SET SoPhieuHienTai = ${sophieu} , Status = 1 , locked = GETDATE() where id = ${id}`)
        })
    }
    async CauHoi(id){
        const connect = await this.pool.connect()
        const pool = await connect.request()
        pool.input('cauhoi',mssql.Int,id)
        const result = await pool.query(`SELECT * FROM ${this.table} where id = @id`)
        return result.recordset
    }
    async TanThanh(id){
        const connect = await this.pool.connect()
        const pool = await connect.request()
        pool.input('cauhoi',mssql.Int,id)
        const result = await pool.query("SELECT a.stt,b.Ma_Dai_Bieu, b.Ten_Dai_Bieu FROM BieuQuyetCauHoi a , DanhSachDaiBieu b where BieuQuyet = 1 and CauHoi = @cauhoi and a.Ma_Dai_Bieu = b.Ma_Dai_Bieu order by stt")
        return result.recordset
    }
    async KhongTanThanh(id){
        const connect = await this.pool.connect()
        const pool = await connect.request()
        pool.input('cauhoi',mssql.Int,id)
        const result = await pool.query("SELECT a.stt,b.Ma_Dai_Bieu, b.Ten_Dai_Bieu FROM BieuQuyetCauHoi a , DanhSachDaiBieu b where BieuQuyet = 0 and CauHoi = @cauhoi and a.Ma_Dai_Bieu = b.Ma_Dai_Bieu order by stt")
        return result.recordset
    }
    async insertBieuQuyet(madaibieu,id,bieuquyet){
        const connect = await this.pool.connect()
        const pool = await connect.request()
        pool.input('cauhoi',mssql.Int,id)
        pool.input('bieuquyet',mssql.Int,bieuquyet)
        pool.input('madaibieu',mssql.NVarChar(200),madaibieu)
        pool.query(`INSERT INTO BieuQuyetCauHoi(Ma_Dai_Bieu,CauHoi,BieuQuyet) values(@madaibieu,@cauhoi,@bieuquyet)`)
    }
}
module.exports = DanhSachCauHoi