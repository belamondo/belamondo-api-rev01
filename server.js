/**
 * Native modules
 */
const fs = require('fs');
const { spawn } = require('child_process');

/**
 * Third party modules
 */
const formidable = require('formidable');
const express = require('express');
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * My modules
 */
const _crud = require('./modules/crud2');

app.get('/', (req, res) => {
    new Promise((resolve, reject) => {
        let object = JSON.parse(req.query.params);
        let globalRes = "teste";
        
        if(object.crudAction === "create"){
            if(!object.collection){
                console.log("You need to set a collection.");
                return false;
            }

            if(!object.objectToCollection){
                 console.log("You need to set an object to create.");
                 return false;
            }

            let unique;
            if(!object.unique){
                unique = false;
            } else {
                unique = object.unique;
            }
            let params = {
                collection: object.collection,
                objectToCollection: object.objectToCollection,
                unique: unique
            }

            _crud._create(params);
            
        } else if(object.crudAction === "read"){
            if(!object.collection){
                console.log("You need to set a collection.");
                return false;
            }

            let query;
            if(!object.query){
                query = false;
            } else {
                query = object.query;
            }
            let params = {
                collection: object.collection,
                query: query
            }

            _crud._read(params)
						.then(res => {
							globalRes = res;
							resolve(res);
						})
        } else if(object.crudAction === "set"){
            if(!object.collection){
                console.log("You need to set a collection.");
                return false;
            }

            if(!object.objectToCollection){
                console.log("You need to set an object to update.");
                return false;
            }

            if(!object.query){
                console.log("It's not friday, bitch! Give us at least an where.");
                return false;
            }

            let params = {
                collection: object.collection,
                query: object.query,
                objectToCollection: object.objectToCollection
            }

            _crud._set(params);
        } else if(object.crudAction === "update"){
            if(!object.collection){
                console.log("You need to set a collection.");
                return false;
            }

            if(!object.propertiesToUpdate){
                console.log("You need to set an array of arrays, with property and its value to update.");
                return false;
            }

            if(!object.query){
                console.log("It's not friday, bitch! Give us at least an where.");
                return false;
            }
            
            let params = {
                collection: object.collection,
                query: object.query,
                propertiesToUpdate: object.propertiesToUpdate //[[field, value]]
            }
            
            _crud._update(params);
        }else if(object.crudAction === "delete"){
            if(!object.collection){
                console.log("You need to set a collection.");
                return false;
            }
            
            if(!object.query){
                console.log("It's not friday, bitch! Give us at least an where.");
                return false;
            }
            
            let params = {
                collection: object.collection,
                query: object.query
            }
            
            _crud._delete(params);
        } else {
            console.log("No crud action defined.");
        }
    })
    .then(response => {
			let array = []
			for(let lim = response.length, i = 0; i < lim; i++){
				let json = JSON.parse(response[i]);
				array.push(json);
			}
			res.json(array);
    })
})

app.get('/jsonFileForm', (req, res) => {
    fs.readFile('./html_pages/jsonFileForm.html', 'utf8', (err, html) => {
        res.send(html);
    })
})

app.post('/jsonFilePost', (request, res) => {
    //_crud._createByJson(req);

    
    let form = new formidable.IncomingForm();
    form.parse(request, (err, fields, files) => {
        let ls = spawn("ls", ["./collections/" + fields.collection]);
        
        fs.readFile(files.jsonFile.path, 'utf8', (err, jsonData) => {
            let i = 0;
            let mkdir = spawn("mkdir", ["./collections/" + fields.collection]);
            
            let treatObjectToPrintf, stringToPrintf, idFileName;
            /* Get JSON Data */
            let array = JSON.parse(jsonData);           
            
            createFile = () => {
                treatObjectToPrintf = JSON.stringify(array[i]);
                stringToPrintf = treatObjectToPrintf.replace(/","/g, '",\n"');
                idFileName = new Date().getTime();
                fs.writeFile(__dirname + "/collections/" + fields.collection + "/" + idFileName + i, stringToPrintf, 
                () => {
                    console.log("Entering file "+ i + " de " + array.length)
                    if(i < array.length) {
                        setTimeout(() => {
                            createFile();
                        }, 10)
                    } else {
                        res.json("finish");
                    }
                });

                i++;
            }

            createFile();
        })
    })
})

app.listen(3000, () => {
    console.log('server started');
})