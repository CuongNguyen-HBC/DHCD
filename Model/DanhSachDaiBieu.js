const mssql = require('mssql')
const Model = require('./Model')
const ChiTietDaiBieu = require(`${path}/Model/ChiTietDaiBieu`)
const DienBienDaiHoi = require(`${path}/Model/DienBienDaiHoi`)
const CoDong =  require(`${path}/Model/DanhSachCoDong`)
class DanhSachDaiBieu extends Model{
    constructor(){
        super()
        this.table = 'DanhSachDaiBieu'
    }
    async listDaiBieu(){
        const connect = await this.pool.connect()
        const pool = await connect.request()
        const result = await pool.query(`SELECT * FROM ${this.table} order by created_at DESC`)
        return result.recordset
    }
    async getDaiBieu(cmnd){
        const connect = await this.pool.connect()
        const pool = await connect.request()
        pool.input('cmnd',mssql.NVarChar(200),cmnd)
        const result = await pool.query(`SELECT * FROM ${this.table} where CMND = @cmnd`)
        return result.recordset
    }
    async sttDaiBieu(){
        const connect = await this.pool.connect()
        const pool = await connect.request()
        const result = await pool.query(`SELECT count(*) as 'stt' FROM ${this.table}`)
        return result.recordset[0].stt.toString()
    }
    async insertDaiBieu(tendaibieu,cmnd,id,cptong,option){
        const connect = await this.pool.connect()
        const dienbiendaihoi = new DienBienDaiHoi
        const pool = await connect.request()
        .input('tendaibieu',mssql.NVarChar(200),tendaibieu)
        .input('cmnd',mssql.NVarChar(200),cmnd)
        .input('status',mssql.Int,option)
        .input('cptong',mssql.Int,cptong)
        .query(`INSERT INTO ${this.table}(Ten_Dai_Bieu,CMND,Status,TongCP) values(@tendaibieu,@cmnd,@status,@cptong)`)
        .then(async () =>{
            const connect2 = await this.pool.connect()
            const pool2 = await connect2.request()
            .input('cmnd',mssql.NVarChar(200),cmnd)
            .query(`SELECT * FROM ${this.table} where CMND = @cmnd`).then(res => {
                    const madaibieu = res.recordset[0].Ma_Dai_Bieu
                    if(Array.isArray(id)){
                        id.forEach(el => {
                            const chitiet = new ChiTietDaiBieu
                            chitiet.insertChiTiet(madaibieu,el)
                            const codong = new CoDong
                            codong.updateCoDong(el)
                        })
                    }else{
                         const chitiet = new ChiTietDaiBieu
                         chitiet.insertChiTiet(madaibieu,id)
                        const codong = new CoDong
                        codong.updateCoDong(id)
                    }
                    dienbiendaihoi.checkDieuKien()
                    return madaibieu
                }).catch(err =>{
                    console.log(err)
                })
        })
       
        // pool
        
    }
    async updateSumTongCP(madaibieu){
        const connect = await this.pool.connect()
        const request = await connect.request()
        request.input('madaibieu',mssql.NVarChar(200),madaibieu)
        const result = await request.query("update DanhSachDaiBieu set TongCP = (select SUM(CP_Tong) from DanhSachCoDong a , ChiTietDaiBieu b where a.ID = b.Ma_Co_Dong and b.Ma_Dai_Bieu = @madaibieu ) where Ma_Dai_Bieu =@madaibieu")
        // const result = await request.query("select * from DanhSachCoDong a , ChiTietDaiBieu b where a.ID = b.Ma_Co_Dong and b.Ma_Dai_Bieu = @madaibieu")
     
    }
    async checkOut(madaibieu,macodong){
        const connect = await this.pool.connect()
        const request = await connect.request()
        request.input('macodong',mssql.NVarChar(200),macodong)
        request.query(`update DanhSachCoDong set Status = 0 where ID = @macodong`)
        request.input('madaibieu',mssql.NVarChar(200),madaibieu)
        request.query(`delete from ChiTietDaiBieu where Ma_Dai_Bieu = @madaibieu and Ma_Co_Dong = @macodong`)
    }
    async ThongKeDaiBieu(){
        const connect = await this.pool.connect()
        const request = await connect.request()
        const result =await request.query(`SELECT COUNT(*) as 'sodaibieu', SUM(TongCP) as 'sophieu',online=(SELECT count(*) FROM ${this.table} where Status = 1),offline=(SELECT COUNT(*) FROM ${this.table} where Status = 2) from ${this.table}`)
        const dieukien = await request.query(`SELECT sophieu as 'sophieuhientai', CONVERT(varchar,thoigian,20) as 'locked' from DienBienDaiHoi where noidung = N'Đủ điều kiện' `)
        return {tinhtrang:result.recordset,dieukien:dieukien.recordset}
    }
    async ThongTinDaiBieu(madaibieu){
        const connect = await this.pool.connect()
        const pool = await connect.request()
        .input('madaibieu',mssql.NVarChar(200),madaibieu)
        const result = await pool.query(`SELECT * FROM ${this.table} where Ma_Dai_Bieu=@madaibieu`)
        return result.recordset[0]
    }
    
}
module.exports =  DanhSachDaiBieu