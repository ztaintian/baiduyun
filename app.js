var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var wechat = require('wechat');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

var config = {
  token: 'tiantiansiqi',
  appid: 'wx956adf43bb8036e4',
  encodingAESKey: 'cp48FaYSPbzcPMTaAUmoGxR25b7Cs5pkc8paBIzUW62',
  checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
};
app.use(express.query());
app.use('/wechat', wechat(config, function (req, res, next) {
  // 微信输入信息都在req.weixin上
  //message对象中 包含属性和字段
  //MsgType  数据类型
  //Content  数据内容
  var message = req.weixin;
  if(message.MsgType === 'text'){
	  if (message.Content === '朱田田') {
	    // 回复文本
	    res.reply({
	    	type:'text',
	    	content:'朱田田公众号'
	    });
	  } else {
	    // 图文回复
	    res.reply([
	      {
	        title: '图片',
	        description: '这是图片',
	        picurl: 'http://zttwechat.duapp.com/images/0.jpg',
	        url: 'http://zttwechat.duapp.com/index.html'
	      }
	    ]);
	  }
  }else if(message.MsgType === 'voice'){
    res.reply([
      {
        title: '语音',
        description: '这是语音',
        picurl: 'http://zttwechat.duapp.com/images/1.jpg',
        url: 'http://zttwechat.duapp.com/voice.html'
      }
    ]);
  }else{
    res.reply([
      {
        title: '错了',
        description: '错了',
        picurl: 'http://zttwechat.duapp.com/images/1.jpg',
        url: 'http://zttwechat.duapp.com/voice.html'
      }
    ]);
  }
}));
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
