function searchBook(ptname, callback) {
    var mysql = require("mysql");
    var connection = mysql.createConnection({
        host: '49.234.115.108',
        user: 'memeda',
        password: 'mysqldemima',
        database: 'library230'
    });

    connection.connect(function (err) {
        if (err) {
            console.error('error connecting:' + err.stack)
        }
        //console.log('connected as id ' + connection.threadId);
    });
    connection.query("SELECT * FROM book230 where bookname REGEXP'" + ptname + "';", function (error, results) {
        if (error) throw error;
        connection.end();
        callback(results);
    });
    
}


var path = require('path');
var mysql = require(path.join(__dirname, '../MysqlCon'));
function compare(name, pwd, callback) {
    var sql = 'SELECT password FROM reader where readerID = "' + name + '"';
    mysql.connection.query(sql, function (err, result) {
        if (err || result.length == 0) {
            callback(false);
            console.log('wocuole');
        }
        else if (pwd == result[0].password) {
            callback(true);
            console.log('duile');
        }
    });
}

function applyAccount(newone, callback) {
    mysql.connection.query("INSERT INTO readerlogon VALUES ('" + newone.readerID + "','" + newone.readerName + "','" + newone.readerEmail + "');", function (error, result) {
        if (error)
            callback(false);
        else
            callback(true);
        connection.end();
    });
}

const getReaderInfoById = (id) => {
    return new Promise((res, rej) => {
        // 获取读者信息
        mysql.connection.query(`SELECT * FROM reader WHERE readerID = ${id}`, function (error, results, fields) {
            if (error) throw error;
            let list = []
            results.forEach(result => {
                list.push(Object.assign({}, result))
            })
            res(list);
        });
    })
}

const updateReaderInfo = (reader) => {
    return new Promise((res, rej) => {
        // 更新读者信息
        mysql.connection.query(`UPDATE reader SET readername = '${reader.name}', email = '${reader.email}' WHERE readerID = ${reader.id}`, function (error, results, fields) {
            if (error) throw error;
            res(results);
        });
    })

}

const changePassword = (pass, id) => {
    return new Promise((res, rej) => {
        //修改密码
        mysql.connection.query(`UPDATE reader SET password = '${pass}' WHERE readerID = ${id}`, function (error, results, fields) {
            if (error) throw error;
            res(results);
        });
    })
}

const changePass = async (pass, id) => {
    try {
        await userModel.changePassword(pass, id)
        return true;
    } catch (e) {
        throw new Error('修改密码失败')
    }
}

//计算还有多少天还书
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: '49.234.115.108',
    user: 'memeda',
    password: 'mysqldemima',
    database: 'library230'
});
connection.connect();

var sql = 'select borrowTime from history where bookID = 00001 ';

connection.query(sql, function (err, result) {
    if (err) {
        console.log('[SELECT ERROR] - ', err.message);
        return;
    }
    var temp = new String(result[0].borrowTime);
    var borrowTime = new Date(temp).getTime();
    var nowTime = Date.now();
    var differ = nowTime - borrowTime;
    console.log("已经借书" + Math.round(differ / (24 * 60 * 60 * 1000)) + "天");
});

connection.end();
//书籍要到期时接收邮件提醒
function sendemail(differ)
{
    var nodemailer = require('nodemailer');

    const Transport = nodemailer.createTransport({
        service: 'qq',
        secure: true,
        auth: {
            user: '709472048@qq.com',
            pass: 'utaxgtgbfulkbfcj',
        }
    });

    const mailOptions = {
        from: "709472048@qq.com",
        to: "sxhqzhc@126.com",
        subject: "还书提醒",
        text: "您借的图书即将到期，请按时归还！"
    };

    if (differ < 5 && differ == 5) {
        Transport.sendMail(mailOptions, (err, data) => {
            if (err) {
                console.log(err);
                res.json({ status: 400, msg: "send fail....." })
            } else {
                console.log(data);
                res.json({ status: 200, msg: "邮件发送成功....." })
            }
        });
    }
}

module.exports = {
    searchBook,
    compare,
    applyAccount,
    getReaderInfoById,
    updateReaderInfo,
    changePassword,
    changePass,
    sendemail
};
