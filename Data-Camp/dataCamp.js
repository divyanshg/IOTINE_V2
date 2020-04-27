const mysql = require('mysql');
const dataLake = require('./dataLake').dataLake

class DataCamp {
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

    searchUser(args, callback) {
        this.query(`SELECT * FROM users WHERE user_id = ? OR secret=? LIMIT 1`, [args, args]).then(row => {
            if (!callback) {
                return row[0].username
            } else {
                callback(row[0].username)
            }
        });
    }

    saveUser(details) {

    }
    

    updateFeed(userId, deviceId, feedName, value, callback) {
        this.query('UPDATE feed_vals SET value =? WHERE user_id=? AND deviceID=? AND name=?', [value, userId, deviceId, feedName]).then(res => {
            
            var drop = {
                event: 'publish',
                device: deviceId,
                feed: feedName,
                data: value
            }
            
            //dataLake.pour(userId, drop)

            if (!callback) {
                return res
            } else {
                callback(res)
            }
        })
    }

    getFeedValue(userId, deviceId, feedName, callback) {
        this.query('SELECT value,unit FROM feed_vals WHERE user_id=? AND deviceID=? AND name=?', [userId, deviceId, feedName]).then(row => {
            if (!callback) {
                return JSON.stringify({
                    value: row[0].value,
                    unit: row[0].unit,
                    time: row[0].time
                })
            } else {
                callback({
                    value: row[0].value,
                    unit: row[0].unit,
                    time: row[0].time
                })
            }

        })
    }
    
    DMS_SEARCH_DEVICE(CONNS){
        this.query(`SELECT * FROM device_management_service WHERE CONN = ? LIMIT 1`, [CONNS]).then(row => {
            if(row[0].CONN == CONNS){
                return true    
            }else{
                return false    
            }
        });
    }

    close() {
        return new Promise((resolve, reject) => {
            this.connection.end(err => {
                if (err)
                    return reject(err);
                resolve();
            });
        });
    }
}

exports.dataCamp = new DataCamp()

/*
DataCamp.searchUser('bi5b4uib5uib6v54vu6b45b654uibu6b45uib654iub6', (usern) => {
    console.log(usern)
})*/

/*dataCamp.updateFeed('iub54i6bibu64', '', 'retg54', 430, res => console.log) */
//dataCamp.getFeedValue('iub54i6bibu64', '', 'retg54', feed => console.log(feed.value))
