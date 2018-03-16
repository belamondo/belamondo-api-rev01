const fs = require('fs');
const { spawn } = require('child_process');

_create = (params) => {
    return new Promise((resolve, reject) => {
        let ls = spawn("ls", ["./collections/" + params.collection]);

        ls.stdout.on('data', (data) => {
            let treatObjectToPrintf = JSON.stringify(params.objectToCollection);
            let stringToPrintf = treatObjectToPrintf.replace('","', '",\n"');
            let idFileName = new Date().getTime();
            
            fs.writeFileSync(__dirname + "/../collections/" + params.collection + "/" + idFileName, stringToPrintf);

            resolve("Criado com sucesso")
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

            resolve("Criado com sucesso")
        });
                
        ls.on('close', (code) => {
            console.log(`child process exited with code ${code}`);
        });
    })
}

_read = (params) => new Promise((resolve, reject) => {
	let stringToResolve = "";

	if(params.queryByFilename){
		let array = []
		
		for(let lim = params.queryByFilename.length, i = 0; i < lim; i++){
			
			let find = spawn("find", [__dirname + "/../collections/" + params.collection + "/", "-name", params.queryByFilename[i]]);
			
			find.stdout.on('data', data => {
				let cat = spawn("cat", [__dirname + "/../collections/" + params.collection + "/" + params.queryByFilename[i]]);
				
				cat.stdout.on('data', d => {
					array.push(d.toString())
				});
											
				cat.stderr.on('data', d => {
					console.log(`stderr: ${d}`);
				});

				cat.on('close', cod => {
					if(i === (params.queryByFilename.length - 1)){
						console.log(`Closed with code ${cod}`);
						resolve(array);
					}
				});
			})
			
			find.stderr.on('data', data => {
				console.log(`stderr: ${data}`);
			})

			find.on('close', code => {
				if(i === (params.queryByFilename.length - 1)){
					console.log(`Closed with code ${code}`);
				}
			})
		}												 
	} else if(params.query){
		for(let lim = params.query.length, i =0; i < lim; i++) {
			let stringToGrep = '"' + params.query[i][0] + '":*.*' + params.query[i][1],
			grep = spawn("grep", ["-irHl", stringToGrep, __dirname + "/../collections/" + params.collection + "/"]);
			
			let array = []

			grep.stdout.on('data', data => {
				
				let filenameLine = data.toString().split('\n');
				for(let lim = filenameLine.length, j = 0; j < lim; j++){
					let filename = filenameLine[j].split('/');
					let cat = spawn("cat", [__dirname + "/../collections/" + params.collection + "/" + filename[filename.length - 1]]);

					cat.stdout.on('data', d => { 
						array.push(d.toString())
					});

					cat.stderr.on('data', d => {
						console.log(`stderr: ${d}`);
					});

					cat.on('close', cod => {
						if(i === (params.query.length - 1) && j === (filenameLine.length - 1)){
							console.log(`Closed with code ${cod}`);
							resolve(array);
						}
					})
				}
			})
			
			grep.stderr.on('data', data => {
				console.log(`stderr: ${data}`);
			})

			grep.on('close', code => {
				if(i === (params.query.length - 1)){
					console.log(`Closed with code ${code}`);
				}
				
				if(code === 1){
					array.push('{"message":"Nothing found!"}')
					resolve(array);
				}
			})
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