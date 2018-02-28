const fs = require("fs");

_create = (params) => new Promise((resolve, reject) => {
    let array = [];
    let notUnique = false;
    
    if(!params.collection){
        console.log("You must define a collection to be created!");
        return false;
    }

    if(!params.objectToCollection){
        console.log("No data was sent to this collection.");
        return false;
    }

    new Promise((resolve, reject) => {
        if(params.unique){
            let checkCount = 0;
            if(fs.existsSync(params.collection)){
                fs.readFile(__dirname + "./../" + params.collection, "utf8", (err, data) => {
                    let string = data;
                    let json = JSON.parse(string);
                    for(let lim = json.length, i = 0; i < lim; i++){
                        for(let limUnique = params.unique.length, j = 0; j < limUnique; j++){
                            if(params.unique[j].value === json[i][params.unique[j].field]){
                                console.log(params.unique[j].value + " = " + json[i][params.unique[j].field])
                                checkCount++;
                            }
                            if(checkCount === limUnique){
                                notUnique = true;
                            }
                        }
                    }
                    resolve(notUnique);
                });
            } else {
                resolve(notUnique);
            }
        } else {
            resolve(notUnique);
        }
    })
    .then(res => {
        if(notUnique){
            resolve("This register is not unique.");
        } else {
            let date = new Date();
            params.objectToCollection.id = date.getTime();
            if(fs.existsSync(params.collection)){
                fs.readFile(__dirname + "./../" + params.collection, "utf8", (err, data) => {
                    let string = data;
                    let finalString = string.slice(0,-1);
                    fs.writeFileSync(params.collection, finalString + "," + JSON.stringify(params.objectToCollection) + "]");    
                });
            } else {
                fs.writeFileSync(params.collection, "[" + JSON.stringify(params.objectToCollection) + "]");
            }
        }
    })

})

_read = (params) => new Promise((resolve, reject) => {
    fs.readFile(__dirname + "/../" + params.collection, "utf8", (err, data) => {
        let json = JSON.parse(data);
        let array = [];
        if(params.query){
            for(let lim = json.length, i = 0; i < lim; i++){
                for(let limQuery = params.query.length, j = 0; j < limQuery; j++){
                    if(params.query[j][1] === "like"){
                        if(json[i][params.query[j][0]].toLowerCase().includes(params.query[j][2].toLowerCase())){
                            array.push(json[i]);
                        }
                    } else if(params.query[j][1] === "=="){
                        if(json[i][params.query[j][0]].toLowerCase() === (params.query[j][2].toLowerCase())){
                            array.push(json[i]);
                        }
                    } else if(params.query[j][1] === "==="){
                        if(json[i][params.query[j][0]] === (params.query[j][2])){
                            array.push(json[i]);
                        }
                    } else if(params.query[j][1] === ">"){
                        if(json[i][params.query[j][0]] > (params.query[j][2])){
                            array.push(json[i]);
                        }
                    } else if(params.query[j][1] === "<"){
                        if(json[i][params.query[j][0]] < (params.query[j][2])){
                            array.push(json[i]);
                        }
                    } else if(params.query[j][1] === ">="){
                        if(json[i][params.query[j][0]] >= (params.query[j][2])){
                            array.push(json[i]);
                        }
                    } else if(params.query[j][1] === "<="){
                        if(json[i][params.query[j][0]] <= (params.query[j][2])){
                            array.push(json[i]);
                        }
                    } else {
                        console.log("Operator not recognized.");
                    }
                }
            }
            resolve(array);
        } else {
            let string = JSON.stringify(json);
            resolve(string);
        }
    })
})

_set = (params) => new Promise((resolve, reject) => {
    fs.readFile(__dirname + "/../" + params.collection, "utf8", (err, data) => {
        let json = JSON.parse(data);

        for(let lim = json.length, i = 0; i < lim; i++){
            for(let limQuery = params.query.length, j = 0; j < limQuery; j++){
                if(params.query[j][1] === "like"){
                    if(json[i][params.query[j][0]].toLowerCase().includes(params.query[j][2].toLowerCase())){
                        json[i] = params.objectToCollection;
                    }
                } else if(params.query[j][1] === "=="){
                    if(json[i][params.query[j][0]].toLowerCase() === (params.query[j][2].toLowerCase())){
                        json[i] = params.objectToCollection;
                    }
                } else if(params.query[j][1] === "==="){
                    if(json[i][params.query[j][0]] === (params.query[j][2])){
                        json[i] = params.objectToCollection;
                    }
                } else if(params.query[j][1] === ">"){
                    if(json[i][params.query[j][0]] > (params.query[j][2])){
                        json[i] = params.objectToCollection;
                    }
                } else if(params.query[j][1] === "<"){
                    if(json[i][params.query[j][0]] < (params.query[j][2])){
                        json[i] = params.objectToCollection;
                    }
                } else if(params.query[j][1] === ">="){
                    if(json[i][params.query[j][0]] >= (params.query[j][2])){
                        json[i] = params.objectToCollection;
                    }
                } else if(params.query[j][1] === "<="){
                    if(json[i][params.query[j][0]] <= (params.query[j][2])){
                        json[i] = params.objectToCollection;
                    }
                } else {
                    console.log("Operator not recognized.");
                }
            }
        }

        fs.writeFileSync(params.collection, JSON.stringify(json));
    })
})

_update = (params) => new Promise((resolve, reject) => {
    fs.readFile(__dirname + "/../" + params.collection, "utf8", (err, data) => {
        let json = JSON.parse(data);

        for(let lim = json.length, i = 0; i < lim; i++){
            for(let limQuery = params.query.length, j = 0; j < limQuery; j++){
                if(params.query[j][1] === "like"){
                    if(json[i][params.query[j][0]].toLowerCase().includes(params.query[j][2].toLowerCase())){
                        Object.keys(json[i]).forEach(key => {
                            //if property is part of object, update it to new value from param propertiesToUpdate
                            //else create property and give value from param propertiesToUpdate
                            for(let limProperty = params.propertiesToUpdate.length, k = 0; k < limProperty; k++) {
                                if(key === params.propertiesToUpdate[k][0]) {
                                    json[i][key] = params.propertiesToUpdate[k][1];
                                } else {
                                    json[i][params.propertiesToUpdate[k][0]] = params.propertiesToUpdate[k][1];
                                }
                            }
                        });
                    }
                } else if(params.query[j][1] === "=="){
                    if(json[i][params.query[j][0]].toLowerCase() === (params.query[j][2].toLowerCase())){
                        Object.keys(json[i]).forEach(key => {
                            //if property is part of object, update it to new value from param propertiesToUpdate
                            //else create property and give value from param propertiesToUpdate
                            for(let limProperty = params.propertiesToUpdate.length, k = 0; k < limProperty; k++) {
                                if(key === params.propertiesToUpdate[k][0]) {
                                    json[i][key] = params.propertiesToUpdate[k][1];
                                } else {
                                    json[i][params.propertiesToUpdate[k][0]] = params.propertiesToUpdate[k][1];
                                }
                            }
                        });
                    }
                } else if(params.query[j][1] === "==="){
                    if(json[i][params.query[j][0]] === (params.query[j][2])){
                        Object.keys(json[i]).forEach(key => {
                            //if property is part of object, update it to new value from param propertiesToUpdate
                            //else create property and give value from param propertiesToUpdate
                            for(let limProperty = params.propertiesToUpdate.length, k = 0; k < limProperty; k++) {
                                if(key === params.propertiesToUpdate[k][0]) {
                                    json[i][key] = params.propertiesToUpdate[k][1];
                                } else {
                                    json[i][params.propertiesToUpdate[k][0]] = params.propertiesToUpdate[k][1];
                                }
                            }
                        });
                    }
                } else if(params.query[j][1] === ">"){
                    if(json[i][params.query[j][0]] > (params.query[j][2])){
                        Object.keys(json[i]).forEach(key => {
                            //if property is part of object, update it to new value from param propertiesToUpdate
                            //else create property and give value from param propertiesToUpdate
                            for(let limProperty = params.propertiesToUpdate.length, k = 0; k < limProperty; k++) {
                                if(key === params.propertiesToUpdate[k][0]) {
                                    json[i][key] = params.propertiesToUpdate[k][1];
                                } else {
                                    json[i][params.propertiesToUpdate[k][0]] = params.propertiesToUpdate[k][1];
                                }
                            }
                        });
                    }
                } else if(params.query[j][1] === "<"){
                    if(json[i][params.query[j][0]] < (params.query[j][2])){
                        Object.keys(json[i]).forEach(key => {
                            //if property is part of object, update it to new value from param propertiesToUpdate
                            //else create property and give value from param propertiesToUpdate
                            for(let limProperty = params.propertiesToUpdate.length, k = 0; k < limProperty; k++) {
                                if(key === params.propertiesToUpdate[k][0]) {
                                    json[i][key] = params.propertiesToUpdate[k][1];
                                } else {
                                    json[i][params.propertiesToUpdate[k][0]] = params.propertiesToUpdate[k][1];
                                }
                            }
                        });
                    }
                } else if(params.query[j][1] === ">="){
                    if(json[i][params.query[j][0]] >= (params.query[j][2])){
                        Object.keys(json[i]).forEach(key => {
                            //if property is part of object, update it to new value from param propertiesToUpdate
                            //else create property and give value from param propertiesToUpdate
                            for(let limProperty = params.propertiesToUpdate.length, k = 0; k < limProperty; k++) {
                                if(key === params.propertiesToUpdate[k][0]) {
                                    json[i][key] = params.propertiesToUpdate[k][1];
                                } else {
                                    json[i][params.propertiesToUpdate[k][0]] = params.propertiesToUpdate[k][1];
                                }
                            }
                        });
                    }
                } else if(params.query[j][1] === "<="){
                    if(json[i][params.query[j][0]] <= (params.query[j][2])){
                        Object.keys(json[i]).forEach(key => {
                            //if property is part of object, update it to new value from param propertiesToUpdate
                            //else create property and give value from param propertiesToUpdate
                            for(let limProperty = params.propertiesToUpdate.length, k = 0; k < limProperty; k++) {
                                if(key === params.propertiesToUpdate[k][0]) {
                                    json[i][key] = params.propertiesToUpdate[k][1];
                                } else {
                                    json[i][params.propertiesToUpdate[k][0]] = params.propertiesToUpdate[k][1];
                                }
                            }
                        });
                    }
                } else {
                    console.log("Operator not recognized.");
                }
            }
        }

        fs.writeFileSync(params.collection, JSON.stringify(json));
    })
})

_delete = (params) => new Promise((resolve, reject) => {
    fs.readFile(__dirname + "/../" + params.collection, "utf8", (err, data) => {
        let json = JSON.parse(data);

        for(let lim = json.length, i = 0; i < lim; i++){
            for(let limQuery = params.query.length, j = 0; j < limQuery; j++){
                if(params.query[j][1] === "like"){
                    if(json[i][params.query[j][0]].toLowerCase().includes(params.query[j][2].toLowerCase())){
                        json.splice(i,1);
                    }
                } else if(params.query[j][1] === "=="){
                    if(json[i][params.query[j][0]].toLowerCase() === (params.query[j][2].toLowerCase())){
                        json.splice(i,1);
                    }
                } else if(params.query[j][1] === "==="){
                    if(json[i][params.query[j][0]] === (params.query[j][2])){
                        json.splice(i,1);
                    }
                } else if(params.query[j][1] === ">"){
                    if(json[i][params.query[j][0]] > (params.query[j][2])){
                        json.splice(i,1);
                    }
                } else if(params.query[j][1] === "<"){
                    if(json[i][params.query[j][0]] < (params.query[j][2])){
                        json.splice(i,1);
                    }
                } else if(params.query[j][1] === ">="){
                    if(json[i][params.query[j][0]] >= (params.query[j][2])){
                        json.splice(i,1);
                    }
                } else if(params.query[j][1] === "<="){
                    if(json[i][params.query[j][0]] <= (params.query[j][2])){
                        json.splice(i,1);
                    }
                } else {
                    console.log("Operator not recognized.");
                }
            }
        }

        fs.writeFileSync(params.collection, JSON.stringify(json));
    })
})

module.exports = {
    _create,
    _read,
    _update,
    _delete
}