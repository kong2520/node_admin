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

// DELETE
router.post('/delete',function(req,res,next){
    var idx = req.body.idx
    console.log(idx)
    var sql = "delete from users where idx in (?)"

    conn.query(sql,idx, function(err,result)
    {
        if(err) console.error(err);
        if(result.affectedRows > 0){
            console.log(result.affectedRows)
            res.redirect('/user/');
        }
    });
});

module.exports = router;