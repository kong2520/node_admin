var express = require('express');
var router = express.Router();
var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();

router.get('/', function(req, res, next) {
    var sql = "select store_id, name, storeName, phone, date_format(created,'%Y-%m-%d %H:%i:%s') created from store"
    conn.query(sql,(err,rows) => {
        if (err) console.error("err : " + err);
        res.render('store',{title:'입점업체관리',rows:rows});
    })
});

// CREATE
router.get('/create',function(req,res,next)
{
    res.render('store_create',{title : "입점업체 생성"})
});

router.post('/create', function(req,res,next){
    var name = req.body.name;
    var storeName = req.body.storeName;
    var phone = req.body.phone;
    var datas = [name,storeName,phone]
    console.log(datas);
 
    var sql = "insert into store(name, storeName, phone, created) values(?,?,?,now())";
    conn.query(sql,datas, function (err, rows) {
        if (err) console.error("err : " + err);
        res.redirect('/store');
    });
});

// UPDATE
router.get('/update',function(req,res,next)
{
    var store_id = req.query.store_id;
    console.log(store_id);
    var sql = "select store_id, name, storeName, phone from store where store_id=?";
    conn.query(sql,store_id, function(err,row)
    {
        if(err) console.error(err);
        res.render('store_update', {title:"업체정보 수정", row:row[0]});
    });
});

router.post('/update',function(req,res,next){
    var store_id = req.body.store_id
    var name = req.body.name;
    var storeName = req.body.storeName;
    var phone = req.body.phone;
    var data = [name,storeName,phone,store_id]
    console.log(data);
    var sql = "update store set name=?,storeName=?,phone=? where store_id=?";

    conn.query(sql, data,function(err,result)
    {
        if(err) console.error(err);
        if(result.affectedRows > 0){
            console.log(result)
            res.redirect('/store/');
        }
    });
});

// DELETE
router.post('/delete',function(req,res,next){
    var idx = req.body.store_id
    console.log(idx)
    var sql = `delete from store where store_id in (${idx})`

    conn.query(sql, function(err,result)
    {
        if(err) console.error(err);
        if(result.affectedRows > 0){
            console.log(result)
            res.redirect('/store/');
        }
    });
});

module.exports = router;