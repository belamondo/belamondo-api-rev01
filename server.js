/**
 * Native modules
 */
const fs = require('fs');

/**
 * Third party modules
 */
const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const firebase = require('firebase');
const formidable = require('formidable');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/**
 * My modules
 */
const _crud = require('./modules/crud2');

// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:4200');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.get('/crud', (req, res) => {
    new Promise((resolve, reject) => {
        let object = JSON.parse(req.query.params);
        let globalRes;

        if(!object.collection){
            console.log("You need to set a collection.");
            return false;
        }

        let query;
				let queryByFilename;
        
				if(!object.query){
            query = false;
        } else {
            query = object.query;
        }
			
				if(!object.queryByFilename){
            queryByFilename = false;
        } else {
            queryByFilename = object.queryByFilename;
        }
			
        let params = {
            collection: object.collection,
            query: query,
						queryByFilename: queryByFilename
        }

        _crud._read(params)
        .then(res => {
            globalRes = res;
            resolve(res);
        })
        .catch(err => {
            console.log("err:" + err)
        })
        
        // if(object.crudAction === "create"){
        //     if(!object.collection){
        //         console.log("You need to set a collection.");
        //         return false;
        //     }

        //     if(!object.objectToCollection){
        //          console.log("You need to set an object to create.");
        //          return false;
        //     }

        //     let unique;
        //     if(!object.unique){
        //         unique = false;
        //     } else {
        //         unique = object.unique;
        //     }
        //     let params = {
        //         collection: object.collection,
        //         objectToCollection: object.objectToCollection,
        //         unique: unique
        //     }

        //     _crud._create(params);
            
        // } else if(object.crudAction === "read"){
        //     if(!object.collection){
        //         console.log("You need to set a collection.");
        //         return false;
        //     }

        //     let query;
        //     if(!object.query){
        //         query = false;
        //     } else {
        //         query = object.query;
        //     }
        //     let params = {
        //         collection: object.collection,
        //         query: query
        //     }

        //     _crud._read(params)
        //     .then(res => {
        //         globalRes = res;
        //         resolve(res);
        //     })
        // } else if(object.crudAction === "set"){
        //     if(!object.collection){
        //         console.log("You need to set a collection.");
        //         return false;
        //     }

        //     if(!object.objectToCollection){
        //         console.log("You need to set an object to update.");
        //         return false;
        //     }

        //     if(!object.query){
        //         console.log("It's not friday, bitch! Give us at least an where.");
        //         return false;
        //     }

        //     let params = {
        //         collection: object.collection,
        //         query: object.query,
        //         objectToCollection: object.objectToCollection
        //     }

        //     _crud._set(params);
        // } else if(object.crudAction === "update"){
        //     if(!object.collection){
        //         console.log("You need to set a collection.");
        //         return false;
        //     }

        //     if(!object.propertiesToUpdate){
        //         console.log("You need to set an array of arrays, with property and its value to update.");
        //         return false;
        //     }

        //     if(!object.query){
        //         console.log("It's not friday, bitch! Give us at least an where.");
        //         return false;
        //     }
            
        //     let params = {
        //         collection: object.collection,
        //         query: object.query,
        //         propertiesToUpdate: object.propertiesToUpdate //[[field, value]]
        //     }
            
        //     _crud._update(params);
        // }else if(object.crudAction === "delete"){
        //     if(!object.collection){
        //         console.log("You need to set a collection.");
        //         return false;
        //     }
            
        //     if(!object.query){
        //         console.log("It's not friday, bitch! Give us at least an where.");
        //         return false;
        //     }
            
        //     let params = {
        //         collection: object.collection,
        //         query: object.query
        //     }
            
        //     _crud._delete(params);
        // } else {
        //     console.log("No crud action defined.");
        // }
    })
    .then(response => {
        let array = []
        for(let lim = response.length, i = 0; i < lim; i++){
            let json = JSON.parse(response[i]);
            array.push(json);
        }
        res.json(array);
    })
    .catch(err => {
        console.log(err)
    })
})

app.post('/crud', (req, res) => {
    let object = req.body;
    
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

    _crud._create(params)
    .then(() => {
        res.send("Sucesso!")
    })
})

app.put('/crud', (request, response) => {
})

app.delete('/crud', (request, response) => {
})

app.listen(3000, () => {
    console.log('server started');
})