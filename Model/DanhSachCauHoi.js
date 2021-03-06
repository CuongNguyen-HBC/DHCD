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
        const result = await pool.query(`SELECT CONVERT(varchar,locked,20) as 'locked',CauHoi,NoiDungCauHoi,SoPhieuHienTai,Status,id,SoNguoi as 'sodaibieu' FROM ${this.table} order by id`)
        return result.recordset
    }
    async lockCauHoi(id){
        const connect = await this.pool.connect()
        const pool = await connect.request()
        pool.query(`SELECT SUM(TongCP) as 'sophieu', COUNT(*) as 'sl' from DanhSachDaiBieu`).then(async res => {
            const sophieu = res.recordset[0].sophieu
            const songuoi = res.recordset[0].sl
            const pool2 = await this.pool.connect()
            console.log(sophieu,id)
            pool2.query(`UPDATE DanhSachCauHoi SET SoPhieuHienTai = ${sophieu} , Status = 1 , locked = GETDATE(), SoNguoi = ${songuoi} where id = ${id}`)
        })
    }
    async CauHoi(id){
        const connect = await this.pool.connect()
        const pool = await connect.request()
        pool.input('cauhoi',mssql.Int,id)
        const result = await pool.query(`SELECT * FROM ${this.table} where id = @cauhoi`)
        return result.recordset[0]
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

        const pool2 = await connect.request()
        const check2 = await pool2.query(`select * FROM DanhSachDaiBieu a, DanhSachCauHoi b 
        where a.created_at <= b.locked and b.id = '${id}' and a.Ma_Dai_Bieu = '${madaibieu}'`)
        if(check2.rowsAffected >= 1){
            const check = await pool.query(`SELECT * FROM BieuQuyetCauHoi where Ma_Dai_Bieu = @madaibieu and CauHoi=@cauhoi`)
            if(check.rowsAffected[0] <= 0)
            pool.query(`INSERT INTO BieuQuyetCauHoi(Ma_Dai_Bieu,CauHoi,BieuQuyet) values(@madaibieu,@cauhoi,@bieuquyet)`)
            else return false
        }
        
    }
}
module.exports = DanhSachCauHoi