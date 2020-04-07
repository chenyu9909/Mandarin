'use strict';
var path = require('path');
var express = require('express');
var readerlogic = require(path.join(__dirname, '../Logic/Reader/ReaderLogic'));
var router = express.Router();

/* GET admin pages. */
router.get('/search', function (req, res) {
    res.render("SearchMain", { title: "HTML" });
});

router.get('/login', function (req, res) {
    res.render("readerLog", { title: "HTML" });
});

/*router.post('/authen', function (req, res) {
    console.log('Form (from querystring): ' + req.body.account);
    res.render("Page2");
});*/

router.get('/search_result', function (req, res) {
    var pt = req.query.bookname;
    readerlogic.searchBook(pt, function (info) {
        res.send(info);
    });
})
router.post('/authen', function (req, res) {
    //�ص�����
    function authenResult(bool) {
        if (bool) {
            req.session.readerUser = req.body.account; // ��¼�ɹ������� session
            res.json({ code: 0 });
        }
        else {
            res.json({ code: 2 });
        }
    };
    //����ҵ���߼���ҵ���߼��п��Ե�������ĺ���ʵ�ֽ������
   ReaderLogic.login(req.body.account, req.body.pwd, authenResult);
});

router.get('/', function (req, res) {
    res.send('respond with a resource');
});

router.get('/reader/:id', async function (req, res) {
    //await �첽ִ��
    let reader = await userController.getReaderInfoById(req.params.id)
    return res.json({ code: 0, msg: '', data: reader });
})

router.put('/reader/:id', async function (req, res) {
    const { name, email } = req.body;
    const id = req.params.id
    let result = await userController.updateReaderInfo({ name, email, id })
    return res.json({ code: 0, msg: '�޸ĳɹ�', data: result });
})

router.post('/changepass/:id', async function (req, res) {
    const { pass } = req.body;
    const id = req.params.id
    let reader = await userController.changePass(pass, id)
    return res.json({ code: 0, msg: '�޸ĳɹ�', data: reader });
})
module.exports = router;