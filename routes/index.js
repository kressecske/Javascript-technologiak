var express = require('express');
var router = express.Router();
var passport = require('passport');
var Datastore = require('nedb'),
    db = new Datastore({ filename: 'temak.nedb', autoload: true });
rekordokdb = new Datastore({ filename: 'rekordok.nedb', autoload: true });
var flash = require('connect-flash');




function isLoggedIn(req, res, next) {
    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return true;

    // if they aren't redirect them to the home page
    return false;
}

router.param('id', function (req, res, next, id) {
  next();
});
router.param('getadat', function (req, res, next, id) {
  next();
});
/* GET home page. */
router.get('/', function(req, res, next) {
  var cookie = req.cookies.skin;
  if(cookie === undefined ) cookie = 0;
  var username= null;
  var admin = false;
  if(req.user != null){
    username = req.user.username;
    admin = req.user.admin;
  }
  db.find({},function(err,docs){
    var menu = []
    for(var i=0;i<docs.length;i++){
      menu.push(docs[i].name);
    }
    if(cookie>=docs.length) cookie=0;
    res.render('index', { 
    title: 'JS-Tech badandó',
    isLoggedIn: isLoggedIn(req,res,next),
    user: username,
    admin : admin,
    menu : menu,
    name : docs[cookie].name,
    bg : docs[cookie].bg,
    color: docs[cookie].color,
    header: docs[cookie].header,
    headerhov: docs[cookie].headerhov,
    player: docs[cookie].player,
    cella: docs[cookie].cella
  });  
  });  
});
//---------LOGIN PAGE----------

router.get('/login', function(req, res, next) {
  var cookie = req.cookies.skin;
  if(cookie === undefined ) cookie = 0;
  var username= null;
  var admin = false;
  if(req.user != null){
    username = req.user.username;
    admin = req.user.admin;
  }
  db.find({},function(err,docs){
    var menu = []
    for(var i=0;i<docs.length;i++){
      menu.push(docs[i].name);
    }
    if(cookie>=docs.length) cookie=0;
    res.render('login', { 
    title: 'JS-Tech badandó',
    message: req.flash('loginMessage'),
    isLoggedIn: isLoggedIn(req,res,next),
    user: username,
    admin : admin,
    menu : menu,
    name : docs[cookie].name,
    bg : docs[cookie].bg,
    color: docs[cookie].color,
    header: docs[cookie].header,
    headerhov: docs[cookie].headerhov,
    player: docs[cookie].player,
    bot: docs[cookie].bot,
    cella: docs[cookie].cella
  });  
  });  
});

router.post('/login', 
  passport.authenticate('local-login', { 
    successRedirect: '/',
        failureRedirect: '/auth/login',
        title: "Log in"
  })
);
//----------------------------------//
//--------SIGNUP------------------//
router.get('/signup', function(req, res, next) {
  var cookie = req.cookies.skin;
  if(cookie === undefined ) cookie = 0;
  var username= null;
  var admin = false;
  if(req.user != null){
    username = req.user.username;
    admin = req.user.admin;
  }
  db.find({},function(err,docs){
    var menu = []
    for(var i=0;i<docs.length;i++){
      menu.push(docs[i].name);
    }
    if(cookie>=docs.length) cookie=0;
    res.render('register', { 
    title: 'JS-Tech badandó',
    message: req.flash('signupMessage'),
    isLoggedIn: isLoggedIn(req,res,next),
    user: username,
    admin : admin,
    menu : menu,
    name : docs[cookie].name,
    bg : docs[cookie].bg,
    color: docs[cookie].color,
    header: docs[cookie].header,
    headerhov: docs[cookie].headerhov,
    player: docs[cookie].player,
    bot: docs[cookie].bot,
    cella: docs[cookie].cella
  });  
  });  
});


router.post('/signup',  passport.authenticate('local-signup', {
        successRedirect : 'login', // redirect to the secure profile section
        failureRedirect : 'signup', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));
//---------------------------------//
//----------ADMIN-----------------//
router.get('/admin', function(req, res, next) {
  var cookie = req.cookies.skin;
  if(cookie === undefined ) cookie = 0;
  var username= null;
  var admin = false;
  if(req.user != null){
    username = req.user.username;
    admin = req.user.admin;
  }
  if(!admin) res.redirect('/');
  db.find({},function(err,docs){
    var menu = []
    for(var i=0;i<docs.length;i++){
      menu.push(docs[i].name);
    }
    if(cookie>=docs.length) cookie=0;
    res.render('admin', { 
    title: 'JS-Tech beadandó-Admin',
    isLoggedIn: isLoggedIn(req,res,next),
    user: username,
    admin : admin,
    menu : menu,
    name : docs[cookie].name,
    bg : docs[cookie].bg,
    color: docs[cookie].color,
    header: docs[cookie].header,
    headerhov: docs[cookie].headerhov,
    player: docs[cookie].player,
    bot: docs[cookie].bot,
    cella: docs[cookie].cella,
    tema: docs
  });  
  });  
});
//---DELETE
router.get('/delete/:id',function(req,res,next){
  var index = req.params.id;
  var id = null;
  db.find({}, function(err,docs){
      console.log(index);
      id = docs[index].name;
      db.remove({ name: id }, {});
  })
  
  res.redirect('/admin');
});

router.get('/edit/:id',function(req,res,next){
  var cookie = req.cookies.skin;
  if(cookie === undefined ) cookie = 0;
  var username= null;
  var admin = false;
  if(req.user != null){
    username = req.user.username;
    admin = req.user.admin;
  }
  if(!admin) res.redirect('/');
  db.find({},function(err,docs){
    var menu = []
    for(var i=0;i<docs.length;i++){
      menu.push(docs[i].name);
    }
    if(cookie>=docs.length) cookie=0;
    res.render('edit', { 
    title: 'JS-Tech beadandó-Admin',
    isLoggedIn: isLoggedIn(req,res,next),
    user: username,
    admin : admin,
    menu : menu,
    name : docs[cookie].name,
    bg : docs[cookie].bg,
    color: docs[cookie].color,
    header: docs[cookie].header,
    headerhov: docs[cookie].headerhov,
    player: docs[cookie].player,
    bot: docs[cookie].bot,
    cella: docs[cookie].cella,
    tema: docs,
    id: req.params.id,
    hiba: req.flash('hibak')
  });  
  });
});
router.post('/edit/:id', function(req,res,next){

    var new_name = req.body.name;
    var new_bg = req.body.bg;
    var new_color = req.body.color;
    var new_header =req.body.header;
    var new_headerhov = req.body.headerhov;
    var new_cella = req.body.cella;
    var id = req.params.id;
    var hibak = []
    if(new_name.length == 0){
      hibak.push('Nincs megadva a név!');
    }
    if(new_bg.length == 0){
      hibak.push('Nincs megadva a háttér!');
    }
    if(new_color.length == 0){
      hibak.push('Nincs megadva a szöveg szín!');
    }
    if(new_header.length == 0){
      hibak.push('Nincs megadva a fejléc szín!');
    }
    if(new_headerhov.length == 0){
      hibak.push('Nincs megadva a fejléc áttűnési színe!');
    }
    if(new_cella.length == 0){
      hibak.push('Nincs megadva a cella szegély színe!');
    }
    //TODO FILE UPLOAD
    if(hibak.length == 0){
      var old_name;
      db.find({}, function (err, docs) {
        if(id<docs.length){
            old_name = docs[id].name;
            db.update({ name: old_name }, { name: new_name,
            bg: new_bg,
            color: new_color,
            header: new_header,
            headerhov: new_headerhov,
            cella: new_cella}, {}, function (err, numReplaced) { });
        }else{
          db.insert({ name: new_name,
            bg: new_bg,
            color: new_color,
            header: new_header,
            headerhov: new_headerhov,
            cella: new_cella})
        };
      }); 
      res.redirect('/admin');
    }else{
      req.flash('hibak', hibak);
      res.redirect('/edit/'+id);
    }
    
});

function compare(a,b) {
  return b.pont - a.pont
}

router.get('/rekordment/:getadat',function(req,res,next){
  if(req.user != null){
    var pont = req.params.getadat;
    var username = req.user.username;
    var date =new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
    var str = date + "    " + pont + " pont.";
  
  rekordokdb.findOne({ name: username }, function (err, doc) {
      if(doc != null){
        if(doc.records.length < 10){
          var recs = doc.records;
          recs.push({date:date,pont:pont});
          recs.sort(compare);
            rekordokdb.update({ name: username },
              { name: username, records: recs }, {}, function (err, numReplaced) {
            
            });
        }else{
              var recs = doc.records;
              recs.push({date:date,pont:pont});
              recs.sort(compare);
              recs.splice(-1,1);
              rekordokdb.update({ name: username },
              { name: username, records: recs }, {}, function (err, numReplaced) {
            
              });
        }
      }else{
        rekordokdb.insert({
            name: username,
            records: [{
              date: date,
              pont: pont
            }]
        });
      }
      res.send(doc);
  });
  }
});




router.get('/setcookie/:id', function (req, res,next) {
    res.cookie('skin', req.params.id);
    res.redirect('/');
});

module.exports = router;