const excel = require('exceljs')
const mssql = require('mssql')
const config = {
    user:process.env.DB_USER || 'sa',
    password:process.env.DB_PASSWORD || '*hbc123',
    server:process.env.DB_HOST || '192.168.3.4',
    port:parseInt(process.env.DB_PORT,10) || 1433,
    database:process.env.DB_NAME || 'DaiHoiCoDong' ,
    options:{
        "encrypt": false,
        "enableArithAbort": false
    }
}
async function InsertCol(id,uid,macodong,tencodong,loaicodong,sodk,codinh,dienthoai,diachi,cptong,cpluuky){
    const pool =  new mssql.ConnectionPool(config)
    const pool1 = await pool.connect()
    const query = await pool1.request()
    query.input('ID',mssql.NVarChar(200),id)
    query.input('UID',mssql.NVarChar(200),uid)
    query.input('Ma_Co_Dong',mssql.NVarChar(200),macodong)
    query.input('Ten_Co_Dong',mssql.NVarChar(200),tencodong)
    query.input('Loai_Co_Dong',mssql.Int,loaicodong)
    query.input('So_DKNSH',mssql.NVarChar(200),sodk)
    query.input('Co_Dinh',mssql.NVarChar(200),codinh)
    query.input('Dien_Thoai',mssql.NVarChar(200),dienthoai)
    query.input('Dia_Chi_1',mssql.NVarChar(200),diachi)
    query.input('CP_Tong',mssql.Int,cptong)
    query.input('CP_LuuKy',mssql.Int,cpluuky)
    query.query(`INSERT INTO DanhSachCoDong(ID,UID,Ma_Co_Dong,Ten_Co_Dong,Loai_Co_Dong,So_DKNSH,Co_Dinh,Dien_Thoai,Dia_Chi_1,CP_Tong,CP_LuuKy) values(@ID,@UID,@Ma_Co_Dong,@Ten_Co_Dong,@Loai_Co_Dong,@So_DKNSH,@Co_Dinh,@Dien_Thoai,@Dia_Chi_1,@CP_Tong,@CP_LuuKy)`)

} 
const workbook = new excel.Workbook()
workbook.xlsx.readFile(`${__dirname}/DHCD.xlsx`).then(() => {
    var worksheet = workbook.getWorksheet('Sheet1')
    worksheet.eachRow({ includeEmpty: false }, function(row, rowNumber) {
     if(rowNumber>=2){
        const id = row.values[1]
        const uid = row.values[2].result
        const macodong = row.values[3]
        const tencodong = row.values[4]
        const loaicodong = row.values[5]
        const sodk = row.values[6]
        const codinh = row.values[7]
        const dienthoai = row.values[8]
        const diachi = row.values[9]
        const cptong = row.values[10]
        const cpluuky = row.values[11]
      
          InsertCol(id,uid,macodong,tencodong,loaicodong,sodk,codinh,dienthoai,diachi,cptong,cpluuky) 
     }
    
      });
})
