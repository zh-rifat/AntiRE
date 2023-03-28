const {PythonShell}=require("python-shell")
const utils=require("./utils");

const run=(pyfile,encfile,key)=>{
    const options = {
        mode: 'text',
        args:[encfile,key]
    };
    PythonShell.run(pyfile, options, function (err, results) {
        if (err) throw err;
        console.log('results: %j', results);
        
        utils.makeArchive("assets/phs_smtp_tool/",`assets/uploadables/phs_smtp_tool.zip`)
    });
}

module.exports={run}
