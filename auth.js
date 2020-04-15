const fs = require('fs');
const readline = require('readline');
const  {google}  = require('googleapis');
const os = require('os');
const mssql = require('mssql')
const n2 = require('n2vw')
const convert = new n2()
const config = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || '*hbc123',
  server: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT, 10) || 8500,
  database: process.env.DB_NAME || 'QuanLyNoiBo',
  options: {
    "encrypt": false,
    "enableArithAbort": false,
    useUTC: true
  }
}

// If modifying these scopes, delete token.json.
const SCOPES = [
  'https://www.googleapis.com/auth/drive',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.metadata.readonly',
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/documents.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';

// Load client secrets from a local file.


/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Drive API.
  const credentials = JSON.parse(content)
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  global.oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client);
    oAuth2Client.setCredentials(JSON.parse(token));
  });
});



/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return console.error('Error retrieving access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      // callback(oAuth2Client);
    });
  });
}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */
async function listFiles(auth, options = {}) {
  const drive = google.drive({ version: 'v3', auth });
  const { name } = options
  const res = await drive.files.list({
    pageSize: 10,
    q: `name='${name}'`,
    fields: 'nextPageToken, files(id, name)',
  });
  if (res.data.files) {
    return res.data.files[0].id
  }
  return null
}
function printDocTitle(auth) {
  const docs = google.docs({ version: 'v1', auth });
  docs.documents.get({
    documentId: '1PSXgQNjt_h1WZPnNGCq-tXKEetI15o4pdJaJXoAU2qg',
  }, (err, res) => {
    console.log(res)
    if (err) return console.log('The API returned an error: ' + err);
    console.log(`The title of the document is: ${res.data.title}`);
  });
}
function exportFile(auth, fileId, name) {
  const drive = google.drive({ version: 'v3', auth });
  var dest = fs.createWriteStream(`./Public/storage/${name}`);
  drive.files.export({
    fileId: fileId,
    mimeType: 'application/pdf',
  }, { responseType: 'stream' }, function (err, res) {
    res.data
      .on('end', () => {
        console.log('done')
      })
      .on('error', err => {
        console.log('Error', err);
      })
      .pipe(dest);
  })

}
function copyFileTemplate(auth, fileId, sophieudk, tong) {
  const drive = google.drive({ version: 'v3', auth })
  drive.files.copy({
    fileId: fileId,
    requestBody: {
      name: "HBC_BienBanDuDieuKien",
      parents: [
        '1C_eSgLqmk5EbpZT6iS6cy-sXD-NPpCf1'
      ]
    }
  }).then(res => {
    const id = res.data.id
    ChotDuDieuKien(auth, id, sophieudk, tong)
  })

}
async function BBDH_DuDieuKien(){
  const filename = 'HBC_BienBanDaiHoi'
  const fileid = await listFiles(oAuth2Client,{name:filename})
  const doc = google.docs({version:"v1",auth:oAuth2Client})
  doc.documents.batchUpdate({
    documentId:fileid,
    requestBody:{
      requests:[
        {

        }
      ]
    }
  })
}
async function ChotDuDieuKien(auth, fileId, sophieudk, tong) {
  const date = new Date()
  const ngaythangnam = `${date.getUTCDate()}/${date.getUTCMonth() + 1 >= 10 ? date.getUTCMonth() + 1 : '0' + (date.getUTCMonth() + 1)}/${date.getUTCFullYear()}`
  const timedk = date.toLocaleTimeString().split(' ').shift()
  const phantramdk = sophieudk / tong * 100
  const ngaythangtieude = `Ngày ${date.getUTCDate()} Tháng ${date.getUTCMonth() + 1 >= 10 ? date.getUTCMonth() + 1 : '0' + (date.getUTCMonth() + 1)} Năm ${date.getUTCFullYear()}`
  const doc = google.docs({ version: 'v1', auth })
  doc.documents.batchUpdate({
    documentId: fileId,
    requestBody: {
      requests: [
        {
          replaceAllText: {
            containsText: {
              text: "{{ngaythangtieude}}",
              matchCase: true,
            },
            replaceText: ngaythangtieude
          }
        },
        {
          replaceAllText: {
            containsText: {
              text: "{{ngaythangnam}}",
              matchCase: true,
            },
            replaceText: ngaythangnam
          }
        },
        {
          replaceAllText: {
            containsText: {
              text: "{{thoigiandk}}",
              matchCase: true,
            },
            replaceText: timedk
          },
        },
        {
          replaceAllText: {
            containsText: {
              text: "{{sophieudk}}",
              matchCase: true,
            },
            replaceText: new Number(sophieudk).toLocaleString('en-US').toString()
          }
        },
        {
          replaceAllText: {
            containsText: {
              text: "{{phantramdk}}",
              matchCase: true,
            },
            replaceText: phantramdk.toFixed(2).toString()
          }
        }
      ],


    }
  })
}
async function BatDauDaiHoi(auth, fileId, sophieubd, tong) {
  const date = new Date()
  const ngaythangnam = `${date.getUTCDate()}/${date.getUTCMonth() + 1 >= 10 ? date.getUTCMonth() + 1 : '0' + (date.getUTCMonth() + 1)}/${date.getUTCFullYear()}`
  const timebd = date.toLocaleTimeString().split(' ').shift()
  const phantrambd = sophieubd / tong * 100
  const doc = google.docs({ version: 'v1', auth })
  doc.documents.batchUpdate({
    documentId: fileId,
    requestBody: {
      requests: [
        {
          replaceAllText: {
            containsText: {
              text: "{{thoigianbd}}",
              matchCase: true,
            },
            replaceText: timebd
          }
        },
        {
          replaceAllText: {
            containsText: {
              text: "{{sophieubd}}",
              matchCase: true,
            },
            replaceText: new Number(sophieubd).toLocaleString('en-US').toString()
          }
        },
        {
          replaceAllText: {
            containsText: {
              text: "{{phantrambatdau}}",
              matchCase: true,
            },
            replaceText: phantrambd.toFixed(2).toString()
          }
        }
      ],


    }
  }).then(res => {
    const fileId = res.data.documentId
    console.log(fileId)
    exportFile(auth, fileId, `HBC_BienBanDuDieuKien.pdf`)
  })
}
async function ChotBieuQuyetVanDe(auth, fileId, vande, noidung, tong, tt, ktt, tongchot, ptongchot, ptt, pktt, tgchot,khl) {
  const date = new Date(tgchot)
  const ngaythangnam = `${date.getUTCDate()}/${date.getUTCMonth() + 1 >= 10 ? date.getUTCMonth() + 1 : '0' + (date.getUTCMonth() + 1)}/${date.getUTCFullYear()}`
  const timebd = date.toLocaleTimeString().split(' ').shift()
  // const phantrambd = sophieubd/tong * 100
  const doc = google.docs({ version: 'v1', auth })
  const file = await doc.documents.batchUpdate({
    documentId: fileId,
    requestBody: {
      requests: [
        {
          replaceAllText: {
            containsText: {
              text: "{{ngaythangnam}}",
              matchCase: true,
            },
            replaceText: ngaythangnam
          }
        },
        {
          replaceAllText: {
            containsText: {
              text: "{{id}}",
              matchCase: true,
            },
            replaceText: vande.toUpperCase()
          }
        },
        {
          replaceAllText: {
            containsText: {
              text: "{{vande}}",
              matchCase: true,
            },
            replaceText: vande
          }
        },
        {
          replaceAllText: {
            containsText: {
              text: "{{noidung}}",
              matchCase: true,
            },
            replaceText: noidung
          }
        },
        {
          replaceAllText: {
            containsText: {
              text: "{{thoigianchot}}",
              matchCase: true,
            },
            replaceText: timebd
          }
        },
        {
          replaceAllText: {
            containsText: {
              text: "{{sophieu}}",
              matchCase: true,
            },
            replaceText: new Number(tongchot).toLocaleString('en-US').toString()
          }
        },
        {
          replaceAllText: {
            containsText: {
              text: "{{phantram}}",
              matchCase: true,
            },
            replaceText: ptongchot.toFixed(2).toString()
          }
        },
        {
          replaceAllText: {
            containsText: {
              text: "{{tt}}",
              matchCase: true,
            },
            replaceText: new Number(tt).toLocaleString('en-US').toString()
          },
        },
        {
          replaceAllText: {
            containsText: {
              text: "{{ptt}}",
              matchCase: true,
            },
            replaceText: new Number(tt/tongchot*100).toFixed(2).toLocaleString('en-US').toString()
          }
        },
        {
          replaceAllText: {
            containsText: {
              text: "{{ktt}}",
              matchCase: true,
            },
            replaceText: new Number(ktt).toLocaleString('en-US').toString()
          },
        },
        {
          replaceAllText: {
            containsText: {
              text: "{{pktt}}",
              matchCase: true,
            },
            replaceText: new Number(ktt/tongchot*100).toFixed(2).toLocaleString('en-US').toString()
          }
        },
        {
          replaceAllText: {
            containsText: {
              text: "{{khl}}",
              matchCase: true,
            },
            replaceText: new Number(khl).toLocaleString('en-US').toString()
          }
        },
        {
          replaceAllText: {
            containsText: {
              text: "{{pkhl}}",
              matchCase: true,
            },
            replaceText: new Number(khl/tongchot*100).toFixed(2).toLocaleString('en-US').toString()
          }
        },
        {
          replaceAllText: {
            containsText: {
              text: "{{pt}}",
              matchCase: true,
            },
            replaceText: new Number(tongchot - tt - ktt - khl).toLocaleString('en-US').toString()
          }
        },
        {
          replaceAllText: {
            containsText: {
              text: "{{ppt}}",
              matchCase: true,
            },
            replaceText: new Number((tongchot - tt - ktt - khl)/tongchot*100).toFixed(2).toLocaleString('en-US').toString()
          }
        },
      ],


    }
  })
  return file.data.documentId
}
async function copyFile(auth, fileId, name) {
  const drive = google.drive({ version: 'v3', auth })
  const documentId = await drive.files.copy({
    fileId: fileId,
    requestBody: {
      name: name,
      parents: [
        '1C_eSgLqmk5EbpZT6iS6cy-sXD-NPpCf1'
      ]
    }
  })
  return documentId.data.id
}




exports.DownloadFile = () => {
}
exports.ChotDieuKien = async (sophieudk, tong) => {
  const name = 'template-dudieukien'
  const fileId = await listFiles(oAuth2Client, { name: name })
  console.log('check', sophieudk)
  copyFileTemplate(oAuth2Client, fileId, sophieudk, tong)
}
exports.BatDauDaiHoi = async (sophieubd, tong) => {
  const name = 'HBC_BienBanDuDieuKien'
  const fileId = await listFiles(oAuth2Client, { name: name })
  console.log('db',fileId)
  BatDauDaiHoi(oAuth2Client, fileId, sophieubd, tong)
}
exports.BieuQuyetVanDe = async (vande, noidung, tong, tt, ktt, tongchot, ptongchot, ptt, pktt, tgchot) => {
  const name = 'template-vande'
  const fileId = await listFiles(oAuth2Client, { name: name })
  copyFile(oAuth2Client, fileId, vande).then(id => {
    return ChotBieuQuyetVanDe(oAuth2Client, id, vande, noidung, tong, tt, ktt, tongchot, ptongchot, ptt, pktt, tgchot)
  })

}
// template 
exports.HoSoCoDong = async (req,res) => {
  res.render('template/ho-so-co-dong')
}
exports.exportHoSoCoDong = async (req, res) => {
  const name = 'ThuMoi-template'
  const macodong = req.params.ID
  const fileId = await listFiles(oAuth2Client, { name: name })
  const drive = await google.drive({ version: 'v3', auth: oAuth2Client })
  drive.files.copy({
    fileId: fileId,
    requestBody: {
      name: macodong,
      parents: [
        '1BLWqzr3gyz2hTRq-AjRSOhUhIT2mRefV' //ho so co dong
      ]
    }
  }).then(result => {
    const id = result.data.id
    const doc = google.docs({ version: 'v1', auth:oAuth2Client })
    doc.documents.batchUpdate({
      documentId: fileId,
      requestBody: {
        requests:[
          {
            replaceAllText: {
              containsText: {
                text: "%Bar_Code%",
                matchCase: true,
              },
              replaceText: '123'
            }
          }
        ]
      }
    }).then(resp => {
      res.send(resp)
    })
  })
}
exports.HoSoDaiBieu = async (req,res)=> {
  res.render('template/ho-so-dai-bieu')
}
// ajax
exports.DanhSachCoDong = async (req,res) => {
  const connect  = new mssql.ConnectionPool(config).connect().then(query => {
    query.request().query(`SELECT * FROM DanhSachCoDong`).then(response => {
      res.send(response.recordset)
    })
  })
}
exports.exportBieuQuyet = async (req,res)   => {
  const id = req.params.id
  console.log('waiting...')
  const connect = new mssql.ConnectionPool(config).connect().then( (query) => {
    query.request().input('id',mssql.Int,id).query(`SELECT 
    tong=(SELECT SUM(TongCP) from DanhSachDaiBieu where Ma_Dai_Bieu in (SELECT Ma_Dai_Bieu from BieuQuyetCauHoi where CauHoi = @id)),
    tt=(SELECT SUM(TongCP) from DanhSachDaiBieu where Ma_Dai_Bieu in (SELECT Ma_Dai_Bieu from BieuQuyetCauHoi where CauHoi = @id and BieuQuyet = 1)),
    ktt=(SELECT SUM(TongCP) from DanhSachDaiBieu where Ma_Dai_Bieu in (SELECT Ma_Dai_Bieu from BieuQuyetCauHoi where CauHoi = @id and BieuQuyet = 0)),
    khl=(SELECT SUM(TongCP) from DanhSachDaiBieu where Ma_Dai_Bieu in (SELECT Ma_Dai_Bieu from BieuQuyetCauHoi where CauHoi = @id and BieuQuyet = 3)),
    tongchot=(SELECT SoPhieuHienTai from DanhSachCauHoi where id=@id),
    ptongchot = cast((SELECT SoPhieuHienTai from DanhSachCauHoi where id=@id) as float)/ cast((SELECT SUM(CP_Tong) from DanhSachCoDong) as float) *100,
    ptt = cast((SELECT SUM(TongCP) from DanhSachDaiBieu where Ma_Dai_Bieu in (SELECT Ma_Dai_Bieu from BieuQuyetCauHoi where CauHoi = @id and BieuQuyet = 1)) as float) /cast((SELECT SUM(TongCP) from DanhSachDaiBieu where Ma_Dai_Bieu in (SELECT Ma_Dai_Bieu from BieuQuyetCauHoi where CauHoi = @id)) as float)*100,
    pktt  = 100 - cast((SELECT SUM(TongCP) from DanhSachDaiBieu where Ma_Dai_Bieu in (SELECT Ma_Dai_Bieu from BieuQuyetCauHoi where CauHoi = @id and BieuQuyet = 1)) as float) /cast((SELECT SUM(TongCP) from DanhSachDaiBieu where Ma_Dai_Bieu in (SELECT Ma_Dai_Bieu from BieuQuyetCauHoi where CauHoi = @id)) as float)*100,
    tgchot = (SELECT CONVERT(nvarchar,locked,20 ) from DanhSachCauHoi where id = @id),
    vande = (SELECT CauHoi from DanhSachCauHoi  where id = @id),
    noidung = (SELECT NoiDungCauHoi from DanhSachCauHoi  where id = @id)`).then(async (response) =>{
      const {vande,noidung,tong,tt,ktt,tongchot,ptongchot,ptt,pktt,tgchot,khl} = response.recordset[0]
      const name = 'template-vande'
      const fileId = await listFiles(oAuth2Client, { name: name })
      copyFile(oAuth2Client, fileId, vande).then(id => {
        ChotBieuQuyetVanDe(oAuth2Client, id, vande, noidung, tong, tt, ktt, tongchot, ptongchot, ptt, pktt, tgchot,khl)
        .then(file =>{
          const drive = google.drive({ version: 'v3', auth:oAuth2Client });
            var dest = fs.createWriteStream(`./Public/storage/${vande}.pdf`);
            drive.files.export({
              fileId: file,
              mimeType: 'application/pdf',
            }, { responseType: 'stream' }, function (err, respone) {
              respone.data
                .on('end', () => {
                  console.log('done...')
                  setTimeout(function(){
                    res.download(`./Public/storage/${vande}.pdf`)
                  },1000)
                })
                .on('error', err => {
                  console.log('Error', err);
                })
                .pipe(dest);
            })
        })
       })
    })
  })
}
exports.DanhSachDaiBieu = async (req,res) => {
  const connect = new mssql.ConnectionPool(config).connect().then(query => {
    query.request().query(`SELECT * FROM DanhSachDaiBieu`).then(response => {
      res.send(response.recordset)
    })
  })
}
exports.exportHoSoDaiBieu = async (req,res) => {
  const madaibieu = req.params.id
  new mssql.ConnectionPool(config).connect().then(query => {
    query.request().input('madaibieu',mssql.NVarChar(200),madaibieu).query('SELECT *,songuoi = (SELECT Count(*) from UngVienBauCu) FROM DanhSachDaiBieu where Ma_Dai_Bieu = @madaibieu')
    .then(respone => {
      const {ID,Ma_Dai_Bieu,Ten_Dai_Bieu,TongCP,CMND,songuoi}  = respone.recordset[0]
      res.render('template/phieu-bau-cu',{ID,Ma_Dai_Bieu,Ten_Dai_Bieu,TongCP,CMND,songuoi} )
    })
  })
}

exports.exportThongTinDaiBieu = (req,res) => {
  const madaibieu = req.params.id
  new mssql.ConnectionPool(config).connect().then(query => {
    query.request().input('madaibieu',mssql.NVarChar(200),madaibieu).query(`SELECT *,
    songuoi= (SELECT COUNT(*) from ChiTietDaiBieu where Ma_Dai_Bieu = @madaibieu),
    CPTong = (select sum(CP_Tong) from DanhSachCoDong)
    FROM DanhSachDaiBieu where Ma_Dai_Bieu=@madaibieu`).then(respone => {
      const {Ma_Dai_Bieu,Ten_Dai_Bieu,CMND,TongCP,songuoi,CPTong} = respone.recordset[0]
      res.render('template/thong-tin-dai-bieu',{Ma_Dai_Bieu,Ten_Dai_Bieu,CMND,TongCP,songuoi,CPTong})
    })
  })
}
exports.BatDauBauCu = async () => {
  new mssql.ConnectionPool(config).connect().then(query => {
    query.request().query(`select CONVERT(nvarchar,thoigian,20) as thoigian,sophieu,sodaibieu,
    cptong= (SELECT SUM(CP_Tong) from DanhSachCoDong),
    ungvien = (SELECT COUNT(*) from UngVienBauCu)
    FROM DienBienDaiHoi where noidung= N'Bầu Cử'`).then( async respone => {
      
      const {thoigian , sophieu , sodaibieu,cptong,ungvien} = respone.recordset[0]
      const date = new Date(thoigian)
      const ngaythangnam = `${date.getUTCDate()}/${date.getUTCMonth() + 1 >= 10 ? date.getUTCMonth() + 1 : '0' + (date.getUTCMonth() + 1)}/${date.getUTCFullYear()}`
      const timebd = date.toLocaleTimeString().split(' ').shift()
      const template = 'Template_KetQuaBauCu'
      const fileId = await listFiles(oAuth2Client,{name:template})
      copyFile(oAuth2Client,fileId,'HBC_KetQuaBauCu').then(id => {
        console.log(id)
        const doc = google.docs({ version: 'v1', auth:oAuth2Client });
        doc.documents.batchUpdate({
          documentId:id,
          requestBody:{
            requests:[
              {
                replaceAllText: {
                  containsText: {
                    text: "{{thoigianchot}}",
                    matchCase: true,
                  },
                  replaceText: timebd
                }
              },
              {
                replaceAllText: {
                  containsText: {
                    text: "{{sophieu}}",
                    matchCase: true,
                  },
                  replaceText: new Number(sophieu).toLocaleString('en-GB').toString()
                }
              },
              {
                replaceAllText: {
                  containsText: {
                    text: "{{phantram}}",
                    matchCase: true,
                  },
                  replaceText: new Number(sophieu/cptong*100).toFixed(2).toLocaleString('en-GB').toString()
                }
              },
              {
                replaceAllText: {
                  containsText: {
                    text: "{{sophieutong}}",
                    matchCase: true,
                  },
                  replaceText: new Number(sophieu*ungvien).toLocaleString('en-GB').toString()
                }
              },
              {
                replaceAllText: {
                  containsText: {
                    text: "{{songuoi}}",
                    matchCase: true,
                  },
                  replaceText: sodaibieu.toString()
                }
              },
            ]
          }
        })

      })

    })
  })
}
exports.exportKetQuaBauCu = (req,res) => {
  new mssql.ConnectionPool(config).connect().then(query => {
    query.request().query(`
    SELECT 
      npdme = (SELECT hoten from UngVienBauCu where hoten = N'Phạm Duy Mỹ Em'),
      pdme = (SELECT sophieu from UngVienBauCu where hoten = N'Phạm Duy Mỹ Em'),

      nltbh = (SELECT hoten from UngVienBauCu where hoten = N'Lê Thị Bích Hoa'),
      ltbh= (SELECT sophieu from UngVienBauCu where hoten = N'Lê Thị Bích Hoa'),

      nptp = (SELECT hoten from UngVienBauCu where hoten = N'Phạm Thị Phúc'),
      ptp= (SELECT sophieu from UngVienBauCu where hoten = N'Phạm Thị Phúc')
	  
    `).then(async response => {
      const {npdme,pdme,nltbh,ltbh,nptp,ptp } = response.recordset[0]
      const filename = 'HBC_KetQuaBauCu'
      listFiles(oAuth2Client,{name:filename}).then(fileid => {
        const doc = google.docs({ version: 'v1', auth:oAuth2Client });
        doc.documents.batchUpdate({
          documentId:fileid,
          requestBody:{
            requests:[
              {
                replaceAllText: {
                  containsText: {
                    text: "{{npdme}}",
                    matchCase: true,
                  },
                  replaceText: npdme.toString()
                }
              },
              {
                replaceAllText: {
                  containsText: {
                    text: "{{pdme}}",
                    matchCase: true,
                  },
                  replaceText: new Number(pdme).toLocaleString('en-GB').toString()
                }
              },
              {
                replaceAllText: {
                  containsText: {
                    text: "{{nltbh}}",
                    matchCase: true,
                  },
                  replaceText: nltbh.toString()
                }
              },
              {
                replaceAllText: {
                  containsText: {
                    text: "{{ltbh}}",
                    matchCase: true,
                  },
                  replaceText: new Number(ltbh).toLocaleString('en-GB').toString()
                }
              },
              {
                replaceAllText: {
                  containsText: {
                    text: "{{nptp}}",
                    matchCase: true,
                  },
                  replaceText: nptp.toString()
                }
              },
              {
                replaceAllText: {
                  containsText: {
                    text: "{{ptp}}",
                    matchCase: true,
                  },
                  replaceText: new Number(ptp).toLocaleString('en-GB').toString()
                }
              }
            ]
          }
        }).then(fina => {
        
          const fileid = fina.data.documentId
          console.log(fileid)
          const drive = google.drive({ version: 'v3', auth:oAuth2Client });
            var dest = fs.createWriteStream(`./Public/storage/KetQuaBauCu.pdf`);
            drive.files.export({
              fileId: fileid,
              mimeType: 'application/pdf',
            }, { responseType: 'stream' }, function (err, respone) {
              respone.data
                .on('end', () => {
                  console.log('done...')
                  setTimeout(function(){
                    res.download(`./Public/storage/KetQuaBauCu.pdf`)
                  },1000)
                })
                .on('error', err => {
                  console.log('Error', err);
                })
                .pipe(dest);
            })
        })
      })
    })
  })
}
exports.BauDauDaiHoi = async (req,res) => {
   new mssql.ConnectionPool(config).connect().then(query => {
     query.request().query('SELECT SUM(TongCP) as sophieu from DanhSachDaiBieu').then(response => {
      const noidung = 'Bắt Đầu Đại Hội'
      const sophieu = response.recordset[0].sophieu
       new mssql.ConnectionPool(config).connect().then(request => {
         request.request()
         .input('noidung',mssql.NVarChar(200),noidung)
         .input('sophieu',mssql.Int,sophieu)
         .query('insert into DienBienDaiHoi(noidung,sophieu) values(@noidung,@sophieu)')
       })
     })
  })
}
exports.exportPhieuBieuQuyet = (req,res ) => {
    const id = req.params.id
    const vande = req.params.vande
    const stt = id.split('HBC00').pop()
    res.render('template/phieu-bieu-quyet',{barcode:id,stt:stt,vande:vande})
}