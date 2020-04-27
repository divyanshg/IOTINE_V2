const mysql = require('mysql');

class DataLake {
    constructor(config) {
        this.connection = mysql.createConnection({
            host: "localhost",
            user: "divyanshg21",
            password: "potty_khale",
            database: "fila_iot"
        });
    }

    query(sql, args) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, args, (err, rows) => {
                if (err)
                    return reject(err);
                resolve(rows);
            });
        });
        this.close()
    }

    pour(user, msg, callback){
        var mesg = [
            [user,msg]
        ]
        var magicalquery = "INSERT INTO activity SET user=divyanshg809 AND msg='Something...' "
        
        this.query(magicalquery, mesg).then(resp => {
            if(!callback) return resp

            console.log(resp)
            callback(resp)
        })
    }
}

//var dataLake = new DataLake();
//dataLake.pour('divu', 'sdhi')

//exports.dataLake = new DataLake()