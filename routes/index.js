var express = require('express');
var router = express.Router();
const multer = require ('multer')

const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  const db ='mongodb+srv://hungpnph28935:admin@cluster0.dhfnwbe.mongodb.net/oto'
  await mongoose.connect(db);

}
// Định nghĩa schema và model cho collection "Oto"

const otoSchema = new mongoose.Schema(
    {
      maXe:  String,
      tenXe: String,
      giaTien: String,
      namSX:  String,
      hinhAnh: [{ type: String }]

});


const CarModel
    = new mongoose.Schema({
  maXe : String,
  tenXe: String,
  giaTien : String,
  namSX : String,
  hinhAnh : [{ type: String }]

})
/* GET home page. */
router.get('/',async function(req, res, next) {
  const query = mongoose.model('Car', CarModel, 'Car')
  // Luu y truyen dung tham so, neu truyen sai thi mongoose tu tao ra collection theo tham so
  const data = await query.find()
  res.render('index', { title: 'Offical Ferrari Website', data : data, path: '/uploads/' });
});


const path = require("path");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Duong dan luu tru file
  },
  // Tu dong dat ten anh la thoi gian hien tai + 1 so random
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
const upload = multer({
  storage: storage,
});



// So anh toi da mot lan load la 5 anh
const maxFileCount = 5;
router.post('/addCar', (req, res, next) => {
  upload.array('images', maxFileCount)(req, res, async function (err) {
    // Các xử lý lỗi như ở ví dụ trước

    // Kiểm tra xem có file nào được upload hay không
    if (!req.files || req.files.length === 0) {
      return res.status(400).send('Vui lòng chọn ít nhất một tập tin');
    }

    const maXe = req.body.maXe;
    const tenXe = req.body.tenXe;
    const giaTien = req.body.giaTien;
    const namSX = req.body.namSX;
    const hinhAnh = req.files.map(file =>file.originalname);
    console.log(hinhAnh)
    // Lấy đường dẫn ảnh từ các files upload và tạo mảng đường dẫn hình ảnh

    const query = mongoose.model('Car', CarModel, 'Car');
    await query.create({
      maXe: maXe,
      tenXe: tenXe,
      giaTien: giaTien,
      namSX: namSX,
      hinhAnh: hinhAnh, // Thêm các đường dẫn ảnh vào mảng hìnhAnh
    });

    res.redirect('/');
  });
});

router.get('/delete', async function (req,res){
  const maXe = req.query.maXe
  const query = mongoose.model('Car', CarModel, 'Car');
  await query.deleteOne({maXe:maXe})
  // Cap nhat lai danh sach sau khi xoa
  const data = await query.find()
  res.render('index', { title: 'Offical Ferrari Website', data : data, path: '/uploads/' });
})

router.post('/updateCar',async function (req,res){
  upload.array('images', maxFileCount)(req, res, async function (err) {
    // Các xử lý lỗi như ở ví dụ trước

    // Kiểm tra xem có file nào được upload hay không
    if (!req.files || req.files.length === 0) {
      return res.status(400).send('Vui lòng chọn ít nhất một tập tin');
    }

    const maXe = req.body.maXe;
    const tenXe = req.body.tenXe;
    const giaTien = req.body.giaTien;
    const namSX = req.body.namSX;
    const hinhAnh = req.files.map(file =>file.originalname);
    // Lấy đường dẫn ảnh từ các files upload và tạo mảng đường dẫn hình ảnh

    const query = mongoose.model('Car', CarModel, 'Car');
    await query.updateOne({maXe : maXe},{
      tenXe: tenXe,
      giaTien: giaTien,
      namSX: namSX,
      hinhAnh: hinhAnh, // Thêm các đường dẫn ảnh vào mảng hìnhAnh
    })
    res.redirect('/');
  });
})
router.get('/update', async function(req, res, next) {
  res.render('update', { title: 'Express'});
});
module.exports = router;
