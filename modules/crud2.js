const fs = require('fs');
const { spawn } = require('child_process');

_create = (params) => {
    let ls = spawn("ls", ["./collections/" + params.collection]);

    ls.stdout.on('data', (data) => {
        let treatObjectToPrintf = JSON.stringify(params.objectToCollection);
        let stringToPrintf = treatObjectToPrintf.replace('","', '",\n"');
        let idFileName = new Date().getTime();
        
        fs.writeFileSync(__dirname + "/../collections/" + params.collection + "/" + idFileName, stringToPrintf);

        // console.log(data.length)
        // for(let lim = data, i = 0; i < lim; i++) {
        //   console.log(data[i])  
        // }
    });
    
    ls.stderr.on('data', (data) => {
        let mkdir = spawn("mkdir", ["./collections/" + params.collection]);

        let treatObjectToPrintf = JSON.stringify(params.objectToCollection);
        let stringToPrintf = treatObjectToPrintf.replace('","', '",\n"');
        let idFileName = new Date().getTime();
        
        fs.writeFileSync(__dirname + "/../collections/" + params.collection + "/" + idFileName, stringToPrintf);
    });
            
    ls.on('close', (code) => {
        console.log(`child process exited with code ${code}`);
    });
}

_read = (params) => new Promise((resolve, reject) => {
	let stringToResolve = "";
	if(params.query){
		for(let lim = params.query.length, i =0; i < lim; i++) {
			let stringToGrep = '"' + params.query[i][0] + '":*.*' + params.query[i][1],
			grep = spawn("grep", ["-irhC 10", stringToGrep, "/home/cabox/workspace/belamondo-api/collections/" + params.collection + "/"]);
			
			grep.stderr.on('data', data => {
				console.log(`stderr: ${data}`);
			})

			grep.on('close', code => {
				console.log(`Closed with code ${code}`);
			})
			
			resolve(grep);
		}
	} else {
		resolve(stringToResolve); 
	}
})

_update = (params) => {
    console.log(params);
}

_delete = (params) => {
    console.log(params);
}

module.exports = {
    _create,
    _read,
    _update,
    _delete
}