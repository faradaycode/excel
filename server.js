var path = require('path');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(path.resolve(__dirname, '../db/cbt.sqlite'));

db.serialize(function () {
  //create table penilaian
  db.run("CREATE TABLE IF NOT EXISTS penilaian(id_n INTEGER PRIMARY KEY, mapel TEXT, kelas TEXT, nilai INTEGER, analisis TEXT)");
  
  //create table user
  db.run("CREATE TABLE IF NOT EXISTS _user(id_u INTEGER PRIMARY KEY, fullname TEXT, nick TEXT)");
  

  //dumping data
  //4
  db.run("INSERT INTO penilaian VALUES(NULL,?,?,?,null)", ['mtk', '4', 0], function(e) {
    if(e) {
      console.log(e.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  db.run("INSERT INTO penilaian VALUES(NULL,?,?,?,null)", ['ipa', '4', 0], function(e) {
    if(e) {
      console.log(e.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  db.run("INSERT INTO penilaian VALUES(NULL,?,?,?,null)", ['ips', '4', 0], function(e) {
    if(e) {
      console.log(e.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  db.run("INSERT INTO penilaian VALUES(NULL,?,?,?,null)", ['bindo', '4', 0], function(e) {
    if(e) {
      console.log(e.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  db.run("INSERT INTO penilaian VALUES(NULL,?,?,?,null)", ['pkn', '4', 0], function(e) {
    if(e) {
      console.log(e.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  //5
  db.run("INSERT INTO penilaian VALUES(NULL,?,?,?,null)", ['mtk', '5', 0], function(e) {
    if(e) {
      console.log(e.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  db.run("INSERT INTO penilaian VALUES(NULL,?,?,?,null)", ['ipa', '5', 0], function(e) {
    if(e) {
      console.log(e.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  db.run("INSERT INTO penilaian VALUES(NULL,?,?,?,null)", ['ips', '5', 0], function(e) {
    if(e) {
      console.log(e.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  db.run("INSERT INTO penilaian VALUES(NULL,?,?,?,null)", ['bindo', '5', 0], function(e) {
    if(e) {
      console.log(e.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  db.run("INSERT INTO penilaian VALUES(NULL,?,?,?,null)", ['pkn', '5', 0], function(e) {
    if(e) {
      console.log(e.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  //6
  db.run("INSERT INTO penilaian VALUES(NULL,?,?,?,null)", ['mtk', '6a', 0], function(e) {
    if(e) {
      console.log(e.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  db.run("INSERT INTO penilaian VALUES(NULL,?,?,?,null)", ['ipa', '6a', 0], function(e) {
    if(e) {
      console.log(e.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  db.run("INSERT INTO penilaian VALUES(NULL,?,?,?,null)", ['ips', '6a', 0], function(e) {
    if(e) {
      console.log(e.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  db.run("INSERT INTO penilaian VALUES(NULL,?,?,?,null)", ['bindo', '6a', 0], function(e) {
    if(e) {
      console.log(e.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  db.run("INSERT INTO penilaian VALUES(NULL,?,?,?,null)", ['pkn', '6a', 0], function(e) {
    if(e) {
      console.log(e.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  db.run("INSERT INTO penilaian VALUES(NULL,?,?,?,null)", ['mtk', '6b', 0], function(e) {
    if(e) {
      console.log(e.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  db.run("INSERT INTO penilaian VALUES(NULL,?,?,?,null)", ['ipa', '6b', 0], function(e) {
    if(e) {
      console.log(e.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  db.run("INSERT INTO penilaian VALUES(NULL,?,?,?,null)", ['ips', '6b', 0], function(e) {
    if(e) {
      console.log(e.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  db.run("INSERT INTO penilaian VALUES(NULL,?,?,?,null)", ['bindo', '6b', 0], function(e) {
    if(e) {
      console.log(e.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });

  db.run("INSERT INTO penilaian VALUES(NULL,?,?,?,null)", ['pkn', '6b', 0], function(e) {
    if(e) {
      console.log(e.message);
    }
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });
});

db.close();
