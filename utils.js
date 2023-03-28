const archiver = require('archiver');
const fs = require('fs');
const base64=require('base64-js');
const base45=require('base45-js');

const {PythonShell}=require("python-shell");
const crud=require('./db/crud');
// const pyrunner=require("./pyhandler");

const makeArchive=(dir,zipfile)=>{
    const output = fs.createWriteStream(zipfile);
    const archive = archiver('zip', {
        zlib: { level: 0 }
    });

    output.on('close', function() {
        console.log(archive.pointer() + ' total bytes');
        console.log('archiver has been finalized and the output file descriptor has closed.');
    });

    output.on('end', function() {
        console.log('Data has been drained');
    });

    archive.on('warning', function(err) {
        if (err.code === 'ENOENT') {
            console.log(err);
        } else {
            throw err;
        }
    });

    archive.on('error', function(err) {
        throw err;
    });

    archive.pipe(output);

    archive.directory(dir, false);

    archive.finalize();

}


const generateKey=(length)=>{
    const charlist="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let key="";
    for(let i=0;i<length;i++){
        key+=charlist.charAt(Math.floor(Math.random()*(charlist.length))%charlist.length);
    }
    return key;
}

// const getBytes=(s)=>{
//     let res=[];

// }
String.prototype.getBytes = function () {
    var bytes = [];
    for (var i = 0; i < this.length; ++i) {
      bytes.push(this.charCodeAt(i));
    }
    return bytes;
  };
const encryptUid=(uid)=>{
    return base45.encode(Buffer.from(base64.fromByteArray(new Uint8Array(uid.getBytes())).getBytes()),'utf-8');
}
let fileIndex=1;
const getFileIndex=()=>{
    return fileIndex;
}
const updateFileIndex=()=>{
    fileIndex=(fileIndex)%2+1;
}

const pyrun=(pyfile,encfile,key)=>{
    const options = {
        mode: 'text',
        args:[encfile,key]
    };
    PythonShell.run(pyfile, options, async function (err, results) {
        if (err) throw err;
        console.log('results: %j', results);
        
        await makeArchive("assets/phs_smtp_tool/",`assets/uploadables/phs_smtp_tool.tmp`)
        fs.rename('assets/uploadables/phs_smtp_tool.tmp',`assets/uploadables/phs_smtp_tool.zip`,(err)=>{
            if(err)throw err;
            else{
                console.log('file renamed');
            }
        });
    });
}
const generateFile=()=>{
    const uid=generateKey(16);
    console.log(uid)
    const key=generateKey(32);
    crud.uploadKey(uid,key);
    fs.writeFile('assets/phs_smtp_tool/data/profile/user.dat', encryptUid(uid), (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
    // fs.writeFile('assets/phs_smtp_tool/data/profile/key.dat', key, (err) => {
    //     if (err) throw err;
    //     console.log('The file has been saved!');
    // });
    pyrun("encryptor.py","assets/v4.exe", key);
    
    // makeArchive("assets/phs_smtp_tool/",`assets/uploadables/phs_smtp_tool.zip`)
    console.log(`generated: ${fileIndex}`);
}
// generateFile();

module.exports= {makeArchive,generateKey,generateFile,encryptUid,getFileIndex}
