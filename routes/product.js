var express = require('express');
var router = express.Router();
var mysql_odbc = require('../db/db_conn')();
var conn = mysql_odbc.init();

router.get('/', function(req, res, next) {
    var sql = "select idx, name, content, quantity,date_format(created,'%Y-%m-%d %H:%i:%s') created from product"
    conn.query(sql,(err,rows) => {
        if (err) console.error("err : " + err);
        res.render('product',{title:'상품관리',rows:rows});
    })
});

// CREATE
router.get('/create',function(req,res,next)
{
    res.render('product_create',{title : "상품 생성"})
});

router.post('/create', function(req,res,next){
    var name = req.body.name;
    var content = req.body.content;
    var quantity = req.body.quantity;
    var datas = [name,content,quantity]
 
    var sql = "insert into product(name, content, quantity, created) values(?,?,?,now())";
    conn.query(sql,datas, function (err, rows) {
        if (err) console.error("err : " + err);
        res.redirect('/product');
    });
});

// UPDATE
router.get('/update',function(req,res,next)
{
    var idx = req.query.idx;
    console.log(idx);
    var sql = "select idx, name, content, quantity from product where idx=?";
    conn.query(sql,idx, function(err,row)
    {
        if(err) console.error(err);
        res.render('product_update', {title:"상품정보 수정", row:row[0]});
    });
});

router.post('/update',function(req,res,next){
    var idx = req.body.idx
    var name = req.body.name;
    var content = req.body.content;
    var quantity = req.body.quantity;
    var data = [name,content,quantity,idx]
    console.log(data);
    var sql = "update product set name=?,content=?,quantity=? where idx=?";

    conn.query(sql, data,function(err,result)
    {
        if(err) console.error(err);
        if(result.affectedRows > 0){
            console.log(result)
            res.redirect('/product/');
        }
    });
});

// DELETE
router.post('/delete',function(req,res,next){
    var idx = req.body.idx
    console.log(idx)
    var sql = `delete from product where idx in (${idx})`

    conn.query(sql, function(err,result)
    {
        if(err) console.error(err);
        if(result.affectedRows > 0){
            console.log(result)
            res.redirect('/product/');
        }
    });
});

module.exports = router;