const DaiBieuModel = require(`${path}/Model/DanhSachDaiBieu`)
const CoDongModel = require(`${path}/Model/DanhSachCoDong`)
const ChiTietDaiBieuModel = require(`${path}/Model/ChiTietDaiBieu`)
const CauHoiModel = require(`${path}/Model/DanhSachCauHoi`)
const BieuQuyetCauHoiModel =  require(`${path}/Model/BieuQuyetCauHoi`)
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
  const options = req.body.options
  const codong = new CoDongModel
  const daibieu = new DaiBieuModel
  const chitietdaibieu = new ChiTietDaiBieuModel
  daibieu.insertDaiBieu(tendaibieu, cmnd, id,options)
  setTimeout(function () {
    res.redirect('./check-in')
  }, 3000)

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
  const tanthanh = await cauhoi.TanThanh(id)
  const khongtanthanh = await cauhoi.KhongTanThanh(id)
  res.render('admin/bieu-quyet', { tanthanh: tanthanh, khongtanthanh: khongtanthanh,id:id })
}
exports.pBieuQuyet = (req, res) => {
  const id = req.params.id
  const cauhoi = new CauHoiModel
  const options = req.body.options
  const madaibieu = req.body.Ma_Dai_Bieu
  if (options == 1) {
    cauhoi.insertBieuQuyet(madaibieu, id, 1)
  } else {
    cauhoi.insertBieuQuyet(madaibieu, id, 0)
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
exports.ThongKe = async (req,res) => {
  const daibieu = new DaiBieuModel
  const result = await daibieu.ThongKeDaiBieu()
  res.send(result)
}