const  admincontroller = require(`${path}/Controllers/AdminController`)
module.exports = (app) => {
    app.route('/')
    .get(admincontroller.Home)
    app.route('/check-in')
    .get(admincontroller.CheckIn)
    .post(admincontroller.pCheckIn)
    app.route('/thu-moi')
    .get(admincontroller.ThuMoi)
    app.route('/bieu-quyet/:id')
    .get(admincontroller.BieuQuyet)
    .post(admincontroller.pBieuQuyet)
    // AJAX
    app.route('/ajax/ma-co-dong')
    .get(admincontroller.getMaCoDong)
    app.route('/ajax/ma-uy-quyen')
    .get(admincontroller.getMaUyQuyen)
    app.route('/ajax/chot-cau-hoi')
    .get(admincontroller.ChotCauHoi)
    app.route('/ajax/refresh/tan-thanh/:id')
    .get(admincontroller.refreshTanThanh)
    app.route('/ajax/refresh/khong-tan-thanh/:id')
    .get(admincontroller.refreshKhongTanThanh)
    app.route('/ajax/thong-ke')
    .get(admincontroller.ThongKe)
    // Test case
    app.route('/test')
    .get((req,res) => {
        res.render('admin/mc-script')
    })
    app.route('mc-script')
    .get((req,res)=>{
        res.render('admin/mc-script')
    })
    app.route('/slide-show')
    .get((req,res) => {
        res.render('admin/slide-show')
    })
}