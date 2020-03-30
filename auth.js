const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');
const os = require('os');


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
 const {client_secret, client_id, redirect_uris} = credentials.installed;
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
async function listFiles(auth,options={}) {
  const drive = google.drive({version: 'v3', auth});
  const {name} = options
  const res = await drive.files.list({
    pageSize: 10,
    q: `name='${name}'`,
    fields: 'nextPageToken, files(id, name)',
  });
  if(res.data.files){
    return res.data.files[0].id
  }
  return null
}
function printDocTitle(auth) {
    const docs = google.docs({version: 'v1', auth});
    docs.documents.get({
      documentId: '1PSXgQNjt_h1WZPnNGCq-tXKEetI15o4pdJaJXoAU2qg',
    }, (err, res) => {
        console.log(res)
      if (err) return console.log('The API returned an error: ' + err);
      console.log(`The title of the document is: ${res.data.title}`);
    });
  }
  function exportFile(auth,fileId,name){
    const drive = google.drive({version: 'v3', auth});
    var dest = fs.createWriteStream(`./Public/storage/${name}`);
    drive.files.export({
      fileId: fileId,
      mimeType: 'application/pdf',
    },{responseType: 'stream'},function(err, res){
       res.data
       .on('end', () => {
        console.log('done')
        return 
     })
     .on('error', err => {
        console.log('Error', err);
     })
     .pipe(dest);   
    })
    
}
function copyFileTemplate(auth,fileId,sophieudk,tong){
  const drive = google.drive({version: 'v3', auth})
   drive.files.copy({
    fileId:fileId,
    requestBody:{
      name:"BienBanDuDieuKien",
      parents:[
        '1C_eSgLqmk5EbpZT6iS6cy-sXD-NPpCf1'
      ]
    }
  }).then(res => {
    const id = res.data.id
    ChotDuDieuKien(auth,id,sophieudk,tong)
  })
 
}
async function ChotDuDieuKien(auth,fileId,sophieudk,tong){
    const date = new Date()
    const ngaythangnam = `${date.getUTCDate()}/${date.getUTCMonth()+1 >= 10 ? date.getUTCMonth() + 1 : '0'+(date.getUTCMonth()+1)}/${date.getUTCFullYear()}`
    const timedk = date.toLocaleTimeString().split(' ').shift()
    const phantramdk = sophieudk/tong * 100
    const ngaythangtieude = `Ngày ${date.getUTCDate()} Tháng ${date.getUTCMonth()+1 >= 10 ? date.getUTCMonth() + 1 : '0'+(date.getUTCMonth()+1)} Năm ${date.getUTCFullYear()}`
    console.log(ngaythangnam)
    console.log(sophieudk)
    console.log('tong',tong)

    const doc = google.docs({version: 'v1', auth})
     doc.documents.batchUpdate({
        documentId:fileId,
        
        requestBody: {
            requests:[
              {
                replaceAllText:{
                  containsText:{
                    text:"{{ngaythangtieude}}",
                    matchCase:true,
                  },
                  replaceText:ngaythangtieude
                }
              },
              {
                replaceAllText:{
                  containsText:{
                    text:"{{ngaythangnam}}",
                    matchCase:true,
                  },
                  replaceText:ngaythangnam
                }
              },
              {
                replaceAllText:{
                  containsText:{
                    text:"{{thoigiandk}}",
                    matchCase:true,
                  },
                  replaceText:timedk
                },
              },
              {
                replaceAllText:{
                  containsText:{
                    text:"{{sophieudk}}",
                    matchCase:true,
                  },
                  replaceText:new Number(sophieudk).toLocaleString('en-US').toString()
                }
              },
              {
                replaceAllText:{
                  containsText:{
                    text:"{{phantramdk}}",
                    matchCase:true,
                  },
                  replaceText:phantramdk.toFixed(2).toString()
                }
              }
            ],
            
            
        }
    })
}
async function BatDauDaiHoi(auth,fileId,sophieubd,tong){
  const date = new Date()
  const ngaythangnam = `${date.getUTCDate()}/${date.getUTCMonth()+1 >= 10 ? date.getUTCMonth() + 1 : '0'+(date.getUTCMonth()+1)}/${date.getUTCFullYear()}`
  const timebd = date.toLocaleTimeString().split(' ').shift()
  const phantrambd = sophieubd/tong * 100
    const doc = google.docs({version: 'v1', auth})
   doc.documents.batchUpdate({
      documentId:fileId,
      requestBody: {
          requests:[
            {
              replaceAllText:{
                containsText:{
                  text:"{{thoigianbd}}",
                  matchCase:true,
                },
                replaceText:timebd
              }
            },
            {
              replaceAllText:{
                containsText:{
                  text:"{{sophieubd}}",
                  matchCase:true,
                },
                replaceText:new Number(sophieubd).toLocaleString('en-US').toString()
              }
            },
            {
              replaceAllText:{
                containsText:{
                  text:"{{phantrambatdau}}",
                  matchCase:true,
                },
                replaceText:phantrambd.toFixed(2).toString()
              }
            }
          ],
          
          
      }
  }).then(res => {
    const fileId = res.data.documentId
    exportFile(auth,fileId,`BienBanDuDieuKien.pdf`)
  })
}
async function ChotBieuQuyetVanDe(auth,fileId,vande,noidung,tong,tt,ktt,tongchot,ptongchot,ptt,pktt,tgchot){
  const date = new Date(tgchot)
  const ngaythangnam = `${date.getUTCDate()}/${date.getUTCMonth()+1 >= 10 ? date.getUTCMonth() + 1 : '0'+(date.getUTCMonth()+1)}/${date.getUTCFullYear()}`
  const timebd = date.toLocaleTimeString().split(' ').shift()
  // const phantrambd = sophieubd/tong * 100
    const doc = google.docs({version: 'v1', auth})
   doc.documents.batchUpdate({
      documentId:fileId,
      requestBody: {
          requests:[
            {
              replaceAllText:{
                containsText:{
                  text:"{{ngaythangnam}}",
                  matchCase:true,
                },
                replaceText:ngaythangnam
              }
            },
            {
              replaceAllText:{
                containsText:{
                  text:"{{vande}}",
                  matchCase:true,
                },
                replaceText:vande
              }
            },
            {
              replaceAllText:{
                containsText:{
                  text:"{{noidung}}",
                  matchCase:true,
                },
                replaceText:noidung
              }
            },
            {
              replaceAllText:{
                containsText:{
                  text:"{{thoigianchot}}",
                  matchCase:true,
                },
                replaceText:timebd
              }
            },
            {
              replaceAllText:{
                containsText:{
                  text:"{{sophieu}}",
                  matchCase:true,
                },
                replaceText:new Number(tongchot).toLocaleString('en-US').toString()
              }
            },
            {
              replaceAllText:{
                containsText:{
                  text:"{{phantram}}",
                  matchCase:true,
                },
                replaceText:ptongchot.toFixed(2).toString()
              }
            },
            {
              replaceAllText:{
                containsText:{
                  text:"{{tt}}",
                  matchCase:true,
                },
                replaceText:new Number(tt).toLocaleString('en-US').toString()
              },
            },
            {
              replaceAllText:{
                containsText:{
                  text:"{{ptt}}",
                  matchCase:true,
                },
                replaceText:ptt.toFixed(2).toString()
              }
            },
            {
              replaceAllText:{
                containsText:{
                  text:"{{ktt}}",
                  matchCase:true,
                },
                replaceText:new Number(ktt).toLocaleString('en-US').toString()
              },
            },
            {
              replaceAllText:{
                containsText:{
                  text:"{{pktt}}",
                  matchCase:true,
                },
                replaceText:pktt.toFixed(2).toString()
              }
            },
          ],
          
          
      }
  }).then(res => {
    const file = res.data.documentId
  return exportFile(auth,file,vande+'.pdf')
  })
} 
async function copyFile(auth,fileId,name){
  const drive = google.drive({version: 'v3', auth})
  const documentId = await drive.files.copy({
    fileId:fileId,
    requestBody:{
      name:name,
      parents:[
        '1C_eSgLqmk5EbpZT6iS6cy-sXD-NPpCf1'
      ]
    }
  })
  return documentId.data.id
}


exports.DownloadFile = () => {
}
exports.ChotDieuKien = async (sophieudk,tong) => {
 const name = 'template-dudieukien'
 const fileId = await listFiles(oAuth2Client,{name:name})
 console.log('check',sophieudk)
 copyFileTemplate(oAuth2Client,fileId,sophieudk,tong)
}
exports.BatDauDaiHoi = async (sophieubd,tong) => {  
  const name = 'BienBanDuDieuKien'
  const fileId =  await listFiles(oAuth2Client,{name:name})
  BatDauDaiHoi(oAuth2Client,fileId,sophieubd,tong)
}
exports.BieuQuyetVanDe = async (vande,noidung,tong,tt,ktt,tongchot,ptongchot,ptt,pktt,tgchot) => {
  const name = 'template-vande'
  const fileId = await listFiles(oAuth2Client,{name:name})
   copyFile(oAuth2Client,fileId,vande).then(id => {
    return ChotBieuQuyetVanDe(oAuth2Client,id,vande,noidung,tong,tt,ktt,tongchot,ptongchot,ptt,pktt,tgchot)
  })

}