const DaiBieuModel = require(`${path}/Model/DanhSachDaiBieu`)
const CoDongModel = require(`${path}/Model/DanhSachCoDong`)
const ChiTietDaiBieuModel = require(`${path}/Model/ChiTietDaiBieu`)
const CauHoiModel = require(`${path}/Model/DanhSachCauHoi`)
const BieuQuyetCauHoiModel =  require(`${path}/Model/BieuQuyetCauHoi`)
const SlideShowModel =  require(`${path}/Model/SlideShow`)
const DienBienModel =  require(`${path}/Model/DienBienDaiHoi`)
const UngVienModel =  require(`${path}/Model/UngVienBauCu`)
const KetQuaModel =  require(`${path}/Model/KetQuaBauCu`)
const gapi = require(`${path}/auth.js`)
const socket = require('socket.io')
exports.CheckIn = async (req, res) => {
  const daibieu = new DaiBieuModel
  const cauhoi = new CauHoiModel
  const result = await daibieu.listDaiBieu()
  const quest = await cauhoi.listCauHoi()
  const list = []
  const listquest = []
  result.map(i => list.push(i))
  quest.map(i => listquest.push(i))
  res.render('admin/check-in', { list: list, listquest: listquest })
}
exports.Home = (req, res) => {
  res.render('admin/home')
}
exports.ThuMoi = (req, res) => {
  res.render('admin/thu-moi')
}
exports.getMaCoDong = async (req, res) => {
  const barcode = req.query.barcode
  const codong = new CoDongModel
  try {
    const data = codong.getMaCoDong(barcode)
    res.send(await data)
  } catch (error) {
    res.send('error')
  }
}

exports.getMaUyQuyen = async (req, res) => {
  const barcode = req.query.barcode
  const codong = new CoDongModel
  try {
    const data = codong.getMaUyQuyen(barcode)
    res.send(await data)
  } catch (error) {
    res.send('error')
  }
}
exports.pCheckIn = async (req, res) => {
  const tendaibieu = req.body.Ten_Dai_Bieu
  const cmnd = req.body.CMND
  const id = req.body.id
  const cptong = req.body.CP_Tong
  const options = req.body.action
  const codong = new CoDongModel
  const daibieu = new DaiBieuModel
  const chitietdaibieu = new ChiTietDaiBieuModel
  daibieu.insertDaiBieu(tendaibieu, cmnd, id,cptong,options)
  res.redirect('./check-in')
}
exports.pCheckOut = async (req, res) => {
  const madaibieu = req.body.Ma_Dai_Bieu
  const macodong = req.body.Ma_Co_Dong
  const daibieu = new DaiBieuModel
  daibieu.checkOut(madaibieu, macodong)
  setTimeout(function () {
    res.redirect('./check-in')
  }, 1000)

}

exports.BieuQuyet = async (req, res) => {
  const id = req.params.id
  const cauhoi = new CauHoiModel
  const slide = await cauhoi.CauHoi(id)
  const tanthanh = await cauhoi.TanThanh(id)
  const khongtanthanh = await cauhoi.KhongTanThanh(id)
  res.render('admin/bieu-quyet', { tanthanh: tanthanh, khongtanthanh: khongtanthanh,id:id,slide:slide.Slide})
}
exports.pBieuQuyet = (req, res) => {
  const id = req.params.id
  const cauhoi = new CauHoiModel
  const options = req.body.options
  const madaibieu = req.body.Ma_Dai_Bieu
  if (options == 1) {
    cauhoi.insertBieuQuyet(madaibieu, id, 1)
  } else if(options == 0) {
    cauhoi.insertBieuQuyet(madaibieu, id, 0)
  } else {
    cauhoi.insertBieuQuyet(madaibieu, id, 3)
  }

  res.redirect(`./${id}`)
}

exports.ChotCauHoi = async (req, res) => {
  const id = req.query.id
  const cauhoi = new CauHoiModel
  cauhoi.lockCauHoi(id)
  res.send('success')
}
exports.refreshTanThanh = async (req,res) => {
  try {
    const bieuquyetcauhoi = new BieuQuyetCauHoiModel
     const id = req.params.id
    res.send(await bieuquyetcauhoi.listTanThanh(id))
  } catch (error) {
    console.log('loi roi')
    console.log(error)
  }
  
}
exports.refreshKhongTanThanh = async (req,res) => {
  try {
    const bieuquyetcauhoi = new BieuQuyetCauHoiModel
     const id = req.params.id
    res.send(await bieuquyetcauhoi.listKhongTanThanh(id))
  } catch (error) {
    console.log('loi roi')
    console.log(error)
  }
}
exports.refreshKhongHopLe = async (req,res) => {
  try {
    const bieuquyetcauhoi = new BieuQuyetCauHoiModel
     const id = req.params.id
    res.send(await bieuquyetcauhoi.listKhongHopLe(id))
  } catch (error) {
    console.log('loi roi')
    console.log(error)
  }
}
exports.ThongKe = async (req,res) => {
  const daibieu = new DaiBieuModel
  const result = await daibieu.ThongKeDaiBieu()
  res.send(result)
}
exports.SlideShow = async (req,res) => {
  const slideshow = new SlideShowModel
  const slide = await slideshow.SlideShow()
  res.render('admin/slide-show',{slide:slide})
}

exports.DownloadFileBieuQuyet = async (req,res) => {
  const dienbien = new DienBienModel
  const id = req.query.id
  // const id = 1
  const {vande,noidung,tong,tt,ktt,tongchot,ptongchot,ptt,pktt,tgchot} = await dienbien.BieuQuyetVanDe(id)
  gapi.BieuQuyetVanDe(vande,noidung,tong,tt,ktt,tongchot,ptongchot,ptt,pktt,tgchot)
 
  // ()`./Public/storage/${vande}.pdf`)
}

exports.DownloadFileDieuKien = async (req,res) => {
  const dienbien = new DienBienModel
  const {sophieubd,tong} = await dienbien.SoPhieuBatDau()
  gapi.BatDauDaiHoi(sophieubd,tong)
  res.download(`${path}/Public/storage/BienBanDuDieuKien.pdf`)
}
// bầu cử
exports.vBauCu = async (req,res) => {
  const ungvien = new UngVienModel
  const list = await ungvien.listUngVien()
  res.render('admin/ung-vien',{list:list})
}
exports.fBauCu = async (req,res) => {
  const ungvien = new UngVienModel
  const id = req.params.id
  const info =await ungvien.UngVien(id)
  res.render('admin/form-bau-cu',{ungvien:info})
}
exports.pBauCu = async (req,res) => {
  const ungvien = new UngVienModel
  const daibieu = new DaiBieuModel
  const ketqua = new KetQuaModel
  const id = req.params.id
  const {Ma_Dai_Bieu,sophieu} = req.body
  const soungvien = await ungvien.countUngVien()
  const sophieuungvien = await daibieu.ThongTinDaiBieu(Ma_Dai_Bieu)
  const tongphieu = sophieuungvien.TongCP * soungvien
  const spketqua = await ketqua.checkTongPhieu(Ma_Dai_Bieu)
  const spdabau = spketqua.TongPhieu
  const condition = tongphieu - spdabau - sophieu
  if(condition < 0){
    await ketqua.HuyKetQua(Ma_Dai_Bieu)
    res.send('Phiếu không hợp lệ')
  }
  else{
    await ketqua.insertKetQua(Ma_Dai_Bieu,id,sophieu)
    res.redirect(`./${id}`)
  }
}
exports.DanhSachUngVien = async (req,res) => {
  const ungvien = new UngVienModel
  const list = await ungvien.listUngVien()
  res.send({data:list})
}
exports.ThongTinDaiBieu = async (req,res) => {
const madaibieu = req.query.madaibieu
  const ungvien = new UngVienModel
  const daibieu = new DaiBieuModel
  const soungvien = await ungvien.countUngVien()
  const info = await daibieu.ThongTinDaiBieu(madaibieu)
  res.send({info:info,soungvien:soungvien})
}
// live bieu quyet cau hoi
exports.liveBieuQuyet = async (req,res) => {
  const dienbien = new DienBienModel
  const id = req.query.id
  // const id = 1
  const {vande,noidung,tong,tt,ktt,tongchot,ptongchot,ptt,pktt,tgchot,khl} = await dienbien.BieuQuyetVanDe(id)
  
  res.render('slides/bieu-quyet',{vande,noidung,tong,tt,ktt,tongchot,ptongchot,ptt,pktt,tgchot,khl})
}
exports.showMCScript = async (req,res) => {
  const slide = new SlideShowModel
  const mcscript = await slide.MCScript()
  res.render('admin/mc-script',{mcscript})
}
exports.liveBauCu = async (req,res) => {
  const ungvien = new UngVienModel
  const slide = '4'
  const list = await ungvien.listUngVien()
  res.render('slides/bau-cu',{list:list})
}
exports.BatDauBauCu =  (req,res) => {
  const dienbien = new DienBienModel
  const chot = dienbien.BatDauBauCu()
  res.send('ok')
}
exports.DienBienDaiHoi = (req,res) => {
  res.render('admin/dien-bien')
}   