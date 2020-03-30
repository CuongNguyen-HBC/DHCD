create database DaiHoiCoDong
use DaiHoiCoDong
drop database DaiHoiCoDong
create table Users(
username varchar(200) primary key,
password nvarchar(255) not null,
created_at datetime not null default(getdate())
)

insert into Users(username,password) values('admin','Cu@ng123')

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
Status int not null ,
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
SoNguoi int null,
Status int not null default(0),
locked datetime null,
created_at datetime not null default(getdate())
)

create table BieuQuyetCauHoi(
stt int identity(1,1) primary key,
Ma_Dai_Bieu nvarchar(200)  not null,
CauHoi int not null,
BieuQuyet int not null,
created_at datetime not null default(getdate())
)

create table SlideShow(
Slide int primary key not null,
McScript nvarchar(max) null,
SlideImg nvarchar(255) null,
created_at datetime not null default(getdate())
)
create table DienBienDaiHoi(
id int identity(1,1) primary key,
noidung nvarchar(20) unique not null,
thoigian datetime not null default(getdate()),
sophieu int not null default(0)
)
create table UngVienBauCu(
id int identity(1,1) primary key,
hoten nvarchar(200) not null,
sophieu int not null default(0),
created_at datetime not null default(getdate())
)
create table KetQuaBauCu(
maungvien int not null,
madaibieu nvarchar(200) not null,
sophieubau int not null default(0),
created_at datetime not null default(getdate())
)
drop table KetQuaBauCu


select * FROM DanhSachCoDong
drop trigger updateBauCu
create trigger updateBauCu on KetQuaBauCu
after insert,delete
as
set NOCOUNT on;
DECLARE @ungvien as int 
if exists(SELECT * FROM inserted)
begin
select @ungvien = maungvien from inserted
 update UngVienBauCu set sophieu = (SELECT SUM(sophieubau) from KetQuaBauCu where maungvien = @ungvien) where id=@ungvien
end
else
begin
select @ungvien = maungvien from deleted
 update UngVienBauCu set sophieu = (SELECT case when SUM(sophieubau)  is not null then SUM(sophieubau)  ELSE 0  end from KetQuaBauCu where maungvien = @ungvien)  where id=@ungvien
end

create trigger checkout on ChiTietDaiBieu 
after delete
as
set NOCOUNT ON;
DECLARE @madaibieu  as nvarchar(200)
DECLARE @macodong  as nvarchar(200) 
Select @madaibieu =  Ma_Dai_Bieu from deleted group by Ma_Dai_Bieu
SELECT @macodong = Ma_Co_Dong from deleted group by Ma_Co_Dong
begin
update DanhSachDaiBieu set TongCP = (select SUM(CP_Tong) from DanhSachCoDong a , ChiTietDaiBieu b where a.ID = b.Ma_Co_Dong and b.Ma_Dai_Bieu = @madaibieu 
) where Ma_Dai_Bieu = @madaibieu
update DanhSachCoDong set Status = 0 where ID = @macodong
end

drop trigger checkout


select * FROM UngVienBauCu
select * FROM DanhSachCoDong

select * FROM KetQuaBauCu
select * FROM DanhSachDaiBieu
select * FROM UngVienBauCu
delete from KetQuaBauCu
select * FROM KetQuaBauCu