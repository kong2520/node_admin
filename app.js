const express = require('express');
const app = express()
const PORT = 3000;
var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: false}))

// routes
var indexRouter = require('./routes/index');
var userRouter = require('./routes/user');
var productRouter = require('./routes/product');

// use routes
app.use("/", indexRouter);
app.use('/user',userRouter);
app.use('/product',productRouter);

// veiw
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));

//listen
app.listen(PORT, function () {
    console.log('Example app listening on port',PORT);
});