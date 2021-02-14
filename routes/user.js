var express = require('express');
var router = express.Router();
var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();

router.get('/', function(req, res, next) {
    var sql = "select idx, name, email, date_format(created,'%Y-%m-%d %H:%i:%s') created from users"
    conn.query(sql,(err,rows) => {
        if (err) console.error("err : " + err);
        res.render('user',{title:'회원관리',rows:rows});
    })
});

// CREATE
router.get('/create',function(req,res,next)
{
    res.render('user_create',{title : "회원 생성"})
});

router.post('/create', function(req,res,next){
    var name = req.body.name;
    var email = req.body.email;
    var passwd = req.body.passwd;
    var datas = [name,email,passwd]
 
    var sql = "insert into users(name, email, passwd, created) values(?,?,?,now())";
    conn.query(sql,datas, function (err, rows) {
        if (err) console.error("err : " + err);
        res.redirect('/user');
    });
});

// UPDATE
router.get('/update',function(req,res,next)
{
    var idx = req.query.idx;
    console.log(idx);
    var sql = "select idx, name, email, passwd from users where idx=?";
    conn.query(sql,idx, function(err,row)
    {
        if(err) console.error(err);
        res.render('user_update', {title:"회원정보 수정", row:row[0]});
    });
});

router.post('/update',function(req,res,next){
    var idx = req.body.idx
    var name = req.body.name;
    var email = req.body.email;
    var passwd = req.body.passwd;
    var data = [name,email,passwd,idx]
    console.log(data);
    var sql = "update users set name=?,email=?,passwd=? where idx=?";

    conn.query(sql, data,function(err,result)
    {
        if(err) console.error(err);
        if(result.affectedRows > 0){
            console.log(result)
            res.redirect('/user/');
        }
    });
});

// DELETE
router.post('/delete',function(req,res,next){
    var idx = req.body.idx
    var sql = `delete from users where idx in (${idx})`

    conn.query(sql, function(err,result)
    {
        if(err) console.error(err);
        if(result.affectedRows > 0){
            console.log(result)
            res.redirect('/user/');
        }
    });
});

module.exports = router;