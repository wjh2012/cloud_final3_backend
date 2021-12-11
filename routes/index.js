var express = require('express');
var router = express.Router();
var mysql = require('mysql');                   // 데이터 베이스 모듈

/////////////////////////////////////////////////////////////////////

const connection = {                          // 데이터 베이스 연결 설정 
  host: "127.0.0.1",     
  port: "3306",                                // PORT
  user: "root",                                 // 사용자
  password: "11111111",                       // 비밀 번호
  database: "member",                         // Database 명
};

var conn = mysql.createConnection(connection); // DB 연결 객체
conn.connect();                                // DB 연결

// 필요없는 코드 //////////////////////////////////////////////////
router.get('/', function(req, res) {                 // index
  res.send('백엔드 인덱스 입니다');               
})

// 회원 가입 //////////////////////////////////////////////////////
router.post('/register', function(req, res) {  
  const name = req.body.name;
  const id = req.body.id;
  const pwd = req.body.pwd;
  const tel = req.body.tel;
  const job = req.body.job;
  const gender = req.body.gender;
  const hobby = req.body.hobby;
   console.log(name);
  const sql = 'INSERT INTO test (name, id, pwd, tel, job, gender, hobby) VALUES(?, ?, ?, ?, ?, ?, ?)';
    conn.query(sql, [name, id, pwd, tel, job, gender, hobby], function(err, member, fields){
      if(err)   console.log(err);
    res.send(member);                   // 삽입한 회원 정보 응답
    });
});

// 로그인 ////////////////////////////////////////////////////////
router.post('/login', function(req, res) {  
  const id = req.body.id;                    // 아이디
  const pwd = req.body.pwd;              // 패스워드
  sql = 'SELECT * FROM test';             
  var use = 1;

  conn.query(sql, function(err, members, fields){      

  for(var i=0 ; i<members.length ; i++){   // 행(아이템)의 갯수
    if(members[i].id == id && members[i].pwd == pwd) {
      use = 0;
      res.send(members[i]);     // 로그인 되었을 경우 회원 정보 응답
    } 
  }  
  if(use == 1) {
   res.send('-1');              // 로그인 실패
   }
  });
});

router.post('/data/:idx', function(req, res){    
  var idx = req.params.idx;
  var sql = 'SELECT * FROM test WHERE id_1=?';
  conn.query(sql, [idx], function(err, member, fields){
    res.send(member[0]);             // 선택된 회원 정보 응답(edit.vue)에서 사용
  });
});

// 회원 수정 ////////////////////////////////////////////////////
router.post(['/edit/:idx'], function(req, res){    
  const idx = req.params.idx;
  const name = req.body.name;
  const id = req.body.id;
  const pwd = req.body.pwd;
  const tel = req.body.tel;
  const job = req.body.job;
  const gender = req.body.gender;
  const hobby = req.body.hobby;
  console.log(idx)
  var sql = 'UPDATE test SET name=?, id=?, pwd=?, job=? WHERE id_1=?';
  conn.query(sql, [name, id, pwd, job, idx], function(err, result, fields){
    res.send(result);             // 회원 수정 결과 응답
  });
});

// 회원 탈퇴 /////////////////////////////////////////////////////
router.post('/delete/:idx', function(req, res){
  var idx = req.params.idx;
  var sql = 'DELETE FROM test WHERE id_1=?';
  conn.query(sql, [idx], function(err, result){
    res.send('회원 탈퇴');
  });
});

// 어드민 //////////////////////////////////////
router.get('/admin', function(req, res){
  var sql = 'SELECT * FROM test';
  conn.query(sql, function(err, result){
    res.send(result);
  });
});

module.exports = router;