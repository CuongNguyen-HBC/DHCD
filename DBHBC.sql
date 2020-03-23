create database DaiHoiCoDong
use DaiHoiCoDong

create table DanhSachCoDong(
ID nvarchar(200) primary key,
UID nvarchar(200) not null,
Ma_Co_Dong nvarchar(200) not null,
Ten_Co_Dong nvarchar(200)  not null,
Loai_Co_Dong int not null,
So_DKNSH nvarchar(200) not null,
Co_Dinh nvarchar(200) null,
Dien_Thoai nvarchar(200) null,
Dia_Chi_1 nvarchar(200) not null,
CP_Tong int not null default(0),
CP_LuuKy int not null default(0),
Status int not null default(0),
created_at Datetime not null default(GETDATE()),
)

create table DanhSachDaiBieu(
ID int identity(1,1) not null,
Ma_Dai_Bieu as 'HBC000' + convert(nvarchar,ID) ,
Ten_Dai_Bieu nvarchar(200) not null,
CMND nvarchar(100) null unique,
TongCP int not null default(0),
created_at datetime not null default(getdate())
)
create table ChiTietDaiBieu(
ID int identity(1,1) primary key,
Ma_Dai_Bieu nvarchar(200) not null,
Ma_Co_Dong nvarchar(20) not null,
Uy_Quyen nvarchar(20) null,
created_at datetime not null default(getdate())
)
create table DanhSachCauHoi(
id int identity(1,1) primary key,
CauHoi nvarchar(100) not null,
NoiDungCauHoi nvarchar(200) not null,
SoPhieuHienTai int null,
Status int not null default(0),
locked datetime null,
created_at datetime not null default(getdate())
)
create table BieuQuyetCauHoi(
stt int identity(1,1) primary key,
Ma_Dai_Bieu nvarchar(200) unique not null,
CauHoi int not null,
BieuQuyet int not null,
created_at datetime not null default(getdate())
)


drop table DanhSachCauHoi


insert into DanhSachCoDong(ID,UID,Ma_Co_Dong,Ten_Co_Dong,Loai_Co_Dong,So_DKNSH,Co_Dinh,Dien_Thoai,Dia_Chi_1,CP_Tong,CP_LuuKy) values ('180405001','KBI 050',N'CÔNG TY CỔ PHẦN HÒA BÌNH',2,'')
insert into DanhSachDaiBieu(Ten_Dai_Bieu,TongCP) values (N'Cường',1111)
insert into ChiTietDaiBieu(Ma_Dai_bieu,Ma_Co_Dong,Uy_Quyen) values(N'HBC0001',)
drop trigger SumCPTong


create trigger checkout on ChiTietDaiBieu 
after delete
as
set NOCOUNT ON;
DECLARE @madaibieu  as nvarchar(200)
DECLARE @macodong  as nvarchar(200) 
Select @madaibieu =  Ma_Dai_Bieu from deleted group by Ma_Dai_Bieu
SELECT @macodong = Ma_Co_Dong from deleted group by Ma_Co_Dong
begin
update DanhSachDaiBieu set TongCP = (select SUM(CP_Tong) from DanhSachCoDong a , ChiTietDaiBieu b where a.ID = b.Ma_Co_Dong and b.Ma_Dai_Bieu = @madaibieu ) where Ma_Dai_Bieu = @madaibieu
update DanhSachCoDong set Status = 0 where ID = @macodong
end

drop trigger checkout

