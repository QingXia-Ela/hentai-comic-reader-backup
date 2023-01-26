const superagent = require('superagent');
const cheerio = require('cheerio');
const fs = require('fs');
const db = require('./sql.js');

const tagsJson = JSON.parse(fs.readFileSync('./server/tags.json', 'utf8'));

function getNhentai(url){
    superagent.get(url).end((err, res) => {
        if (err){
            console.log("GetBook Error", err);
        }else{
            let $ = cheerio.load(res.text);
            // Tags
            let tagsList = res.text.match(/\/tag\/([\s\S]*?)\//g);
            for (let i in tagsList){
                let tagText = tagsList[i].replace('/tag/', "").replace("/", "");
                try{
                    tagsList[i] = tagsJson[tagText];
                }catch(e){
                    tagsList[i] = tagText;
                }
            }
            // Bookname
            let booknameList = res.text.match(/\<h2\ class\=\"title\"\>([\s\S]*?)\<\/h2\>/g);
            let bookname = booknameList[booknameList.length-1].replace(/\<([\s\S]*?)\>/g, "")
            // Artists
            let artistsList = res.text.match(/\/artist\/([\s\S]*?)\//g);
            for (let i in artistsList){
                let tagText = artistsList[i].replace('/artist/', "").replace("/", "").replace("-", " ");
                artistsList[i] = tagText;
            }
            // ImageList
            let imageList = $('#thumbnail-container').text().match(/nhentai\.net\/galleries\/([\s\S]*?)\"/g);
            for (let i in imageList){
                let imageUrl = "https://i."+imageList[i].replace('"', "").replace("t.", ".");
                imageList[i] = imageUrl;
            }
            
            // getBID
            db.database.all("select bid from book order by bid desc", function(err, bid){
                if (err){
                    console.log("Select Error", err.message);
                }else{
                    let nowBid;
                    try{nowBid = bid[0]['bid']+1;}
                    catch(e){nowBid = 1;}
                    
                    // 創建目錄
                    try{
                        fs.mkdir('./book/db/'+nowBid, ()=>{});
                    }catch(e){
                        console.log("Mkder Error", e);
                    }
                    
                    // Download
                    for (let i in imageList){
                        superagent.get(imageList[i]).end((err, res) => {
                            if (err){
                                console.log("Donwload Error", err);
                            }else{
                                let imgName = imageList[i].split('/');
                                fs.writeFile('./book/db/'+nowBid+"/"+imgName[imgName.length-1], res.body, "binary", function(err) {
                                    if (err) throw err;
                                });
                            }
                        })
                    }
                    let imgName = imageList[0].split('/');
                    db.database.all(`INSERT INTO book (bid, bookname, author, image, tag, time, num) VALUES (${nowBid}, '${bookname}', '${JSON.stringify(artistsList)}', '../server/book/db/${nowBid}/${imgName[imgName.length-1]}', '${JSON.stringify(tagsList)}', ${new Date()/1}, ${imageList.length})`);
                }
            })
        }
    });
}

module.exports = {
    getNhentai
}