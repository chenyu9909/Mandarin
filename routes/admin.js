'use strict';

var path = require('path');
var express = require('express');
var adminlogic = require(path.join(__dirname, '../Logic/Admin/AdminLogic')); 
var router = express.Router();

/* GET admin pages. */
router.get('/', function (req, res) {
    if (req.session.adminUser == null) res.redirect("/admin/login");
    console.log(req.session.adminUser);
    res.render("AdminMain", { title: "HTML" });
});

router.get('/login', function (req, res) {
    res.render("adminLog");
});

router.get('/username', function (req, res) {
    res.json({ userName: req.session.adminUser })
});

router.get('/getLibs', function (req, res) {
    function libsRes(data) {
        res.json(data);
    }
    adminlogic.getlibInfo(libsRes);
});

router.get('/searchLibrarian', function (req, res) {
    function lookupResult(bool, account, pwd) {
        if (bool) {
            res.json({ code: 0, name: account, password: pwd });
        }
        else {
            res.json({ code: 1 });
        }
    };

    adminlogic.lookupLibrarian(req.query.key, lookupResult);

});

router.post('/admin/addLibrarian', function (req, res) {
    var NM = req.body.userName;
    var ID = req.body.libID;
    var PW = req.body.pwd;
    adminlogic.repeatLibrarianID(ID, function (callback) {
        if (callback == 1) res.json({ code: 2 });
        else if (callback == 0) { res.json({ code: 0 }); adminlogic.addLibrarian(NM, ID, PW); }
    })
})


router.post('/updateLibrarian', function (req, res) {
    function updateResult(bool) {
        if (bool) res.json({ code: 0 });
        else res.json({code: 1})
    }

    adminlogic.updateLibrarian(req.body.curName, req.body.newName, req.body.newPassword, updateResult);
})

router.post('/addLibrarian', function (req, res) {
    function addResult(theCode) {
        res.json({ code: theCode });
    }
    adminlogic.addLibrarian(req.body.name, req.body.password, addResult);
})

router.post('/authen', function (req, res) {
    //�ص�����
    function authenResult(bool) {
        if (bool) {
            req.session.adminUser = req.body.account; // ��¼�ɹ������� session
            res.json({ code: 0 });
        }
        else {
            res.json({ code: 1 });
        }
    };
    //����ҵ���߼���ҵ���߼��п��Ե�������ĺ���ʵ�ֽ������
    adminlogic.compare(req.body.account, req.body.pwd, authenResult);
});



module.exports = router;