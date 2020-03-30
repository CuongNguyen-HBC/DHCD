const mssql = require('mssql')
const Model = require('./Model')
const DaiBieuModel = require(`${path}/Model/DanhSachDaiBieu`)
const CoDongModel = require(`${path}/Model/DanhSachCoDong`)
const ChiTietDaiBieuModel = require(`${path}/Model/ChiTietDaiBieu`)
const CauHoiModel = require(`${path}/Model/DanhSachCauHoi`)
const BieuQuyetCauHoiModel =  require(`${path}/Model/BieuQuyetCauHoi`)
const gapi = require(`${path}/auth.js`)
class DienBienDaiHoi extends Model{
    constructor(){
        super()
        this.table = 'DienBienDaiHoi'
    }
    async checkDieuKien(){
        const connect = await this.pool.connect()
        const request = await connect.request()
        const sophieuht = (await request.query(`SELECT SUM(TongCP) as 'sl'  from DanhSachDaiBieu`)).recordset[0].sl
        const tongphieu = (await request.query(`SELECT SUM(CP_Tong) as 'sl'  from DanhSachCoDong`)).recordset[0].sl
        if(sophieuht/tongphieu >= 0.51)
            this.updateDuDieuKien(sophieuht)
    }
    async updateDuDieuKien(sophieu){
        const noidung = 'Đủ điều kiện'
        const connect = await this.pool.connect()
        const request = await connect.request()
        .input('noidung',mssql.NVarChar(200),noidung)
        .input('sophieu',mssql.Int,sophieu)
       const check = await request.query(`SELECT * FROM ${this.table} where noidung=@noidung`)
       if(check.rowsAffected[0] <=0){
        request.query(`INSERT INTO ${this.table}(noidung,sophieu) values(@noidung,@sophieu)`)
        const tong = await request.query("SELECT SUM(CP_Tong) as 'Tong' from DanhSachCoDong")
        gapi.ChotDieuKien(sophieu,tong.recordset[0].Tong)
       }
        
    }
    async SoPhieuChotDK(){
        const noidung = 'Đủ điều kiện'
        const connect = await this.pool.connect()
        const request = await connect.request()
        .input('noidung',mssql.NVarChar(200),noidung)
        const result =  await request.query(`SELECT sophieu as 'sophieudk' FROM ${this.table} where noidung=@noidung`)
        return result.recordset[0]
    }
    async SoPhieuBatDau(){
        const connect = await this.pool.connect()
        const request = await connect.request()
        const result = await request.query(`SELECT tong =  (select SUM(CP_Tong) from DanhSachCoDong), sophieubd = (select SUM(TongCP) from DanhSachDaiBieu)`)
        return {
            tong:result.recordset[0].tong,
            sophieubd:result.recordset[0].sophieubd
        }
    }
    async BieuQuyetVanDe(id){
        const connect = await this.pool.connect()
        const request = await connect.request()
        .input('id',mssql.Int,id)
        const result = await request.query(`
SELECT 
tong=(SELECT SUM(TongCP) from DanhSachDaiBieu where Ma_Dai_Bieu in (SELECT Ma_Dai_Bieu from BieuQuyetCauHoi where CauHoi = @id)),
tt=(SELECT SUM(TongCP) from DanhSachDaiBieu where Ma_Dai_Bieu in (SELECT Ma_Dai_Bieu from BieuQuyetCauHoi where CauHoi = @id and BieuQuyet = 1)),
ktt=(SELECT SUM(TongCP) from DanhSachDaiBieu where Ma_Dai_Bieu in (SELECT Ma_Dai_Bieu from BieuQuyetCauHoi where CauHoi = @id and BieuQuyet = 0)),
tongchot=(SELECT SoPhieuHienTai from DanhSachCauHoi where id=@id),
ptongchot = cast((SELECT SoPhieuHienTai from DanhSachCauHoi where id=@id) as float)/ cast((SELECT SUM(CP_Tong) from DanhSachCoDong) as float) *100,
ptt = cast((SELECT SUM(TongCP) from DanhSachDaiBieu where Ma_Dai_Bieu in (SELECT Ma_Dai_Bieu from BieuQuyetCauHoi where CauHoi = @id and BieuQuyet = 1)) as float) /cast((SELECT SUM(TongCP) from DanhSachDaiBieu where Ma_Dai_Bieu in (SELECT Ma_Dai_Bieu from BieuQuyetCauHoi where CauHoi = @id)) as float)*100,
pktt  = 100 - cast((SELECT SUM(TongCP) from DanhSachDaiBieu where Ma_Dai_Bieu in (SELECT Ma_Dai_Bieu from BieuQuyetCauHoi where CauHoi = @id and BieuQuyet = 1)) as float) /cast((SELECT SUM(TongCP) from DanhSachDaiBieu where Ma_Dai_Bieu in (SELECT Ma_Dai_Bieu from BieuQuyetCauHoi where CauHoi = @id)) as float)*100,
tgchot = (SELECT CONVERT(nvarchar,locked,20 ) from DanhSachCauHoi where id = @id),
vande = (SELECT CauHoi from DanhSachCauHoi  where id = @id),
noidung = (SELECT NoiDungCauHoi from DanhSachCauHoi  where id = @id)
`)
        return result.recordset[0]
    }
}
module.exports = DienBienDaiHoi