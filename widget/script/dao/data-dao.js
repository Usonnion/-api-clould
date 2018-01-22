function copyDBFile() {
  var fs = api.require('fs');
  fs.copyTo({
    oldPath: 'widget://res/deviceDB.db',
    newPath: 'fs://res'
  }, function (ret, err) {
  });
  $api.setStorage('copyDBFile', 1);
}

function openDB() {
  //如果数据库是在widget下面，需要先copy到fs下面， widget下面文件只读
  if ($api.getStorage('copyDBFile') != 1) {
    copyDBFile();
  }
  var db = api.require('db');
  db.openDatabaseSync({
    name: 'deviceDB',
    path: 'fs://res/deviceDB.db'
  });
}

function clearAccounts() {
  var db = api.require('db');
  var ret = db.executeSqlSync({
    name: 'deviceDB',
    sql: "DELETE FROM accounts"
  });
}

function insertAccounts(accounts) {
  var db = api.require('db');
  // var sql = ''
  accounts.map(function (account) {
    db.executeSqlSync({
      name: 'deviceDB',
      sql: "INSERT INTO accounts (cusecode, cusepassword, ccode, iperson) VALUES ('" + account.cusecode + "', '" + account.cusepassword + "', ' " + account.ccode + " ', '" + account.iperson + "');"
    });
    // sql += "INSERT INTO accounts (cusecode, cusepassword, ccode, iperson) VALUES ('" + account.cusecode + "', '" + account.cusepassword + "', ' " + account.ccode + " ', '" + account.iperson + "');"
  });
  // alert(sql);
  // var ret = db.executeSqlSync({
  //   name: 'deviceDB',
  //   sql: sql
  // });

  // var ret2 = db.selectSqlSync({
  //   name: 'deviceDB',
  //   sql: "SELECT * FROM accounts"
  // });
  // alert(JSON.stringify(ret2));
}

function checkUserLoginFromDB(username, password) {
  var db = api.require('db');
  var ret = db.selectSqlSync({
    name: 'deviceDB',
    sql: "SELECT * FROM accounts WHERE cusecode='" + username + "' and cusepassword='" + password + "';"
  });
  // alert(JSON.stringify(ret));
  if (ret.status && ret.data.length > 0) {
    return ret.data[0];
  }
  return false;
}

function insertProducts(products) {
  var db = api.require('db');
  db.executeSqlSync({
    name: 'deviceDB',
    sql: 'DELETE FROM products;'
  });
  // var sql = '';
  products.map(function(product) {
    var sql = "INSERT INTO products (cbarcode, corder, cpname, cpcode, cspec, cunitname) VALUES ('" + product.cbarcode + "', '" + product.corder + "', '" + product.cpname + "', '" + product.cpcode + "', '" + product.cspec + "', '" + product.cunitname + "');"
    db.executeSqlSync({
      name: 'deviceDB',
      sql: sql
    });
  });
  // var ret = db.executeSqlSync({
  //   name: 'deviceDB',
  //   sql: sql
  // });
  // alert(sql);
  // alert(JSON.stringify(ret));
  // var ret1 = db.selectSqlSync({
  //   name: 'deviceDB',
  //   sql: "SELECT * FROM products;"
  // });
  // alert(JSON.stringify(ret1));
}

// 返回值中status  0：商品不存在， 1,：扫描成功 2： 商品已扫描 3：扫描不成功
function insertScanBarCode(barcode) {
  var db = api.require('db');
  var ret = db.selectSqlSync({
    name: 'deviceDB',
    sql: "SELECT * FROM products WHERE cbarcode='" + barcode + "';"
  });
  if (ret.status && ret.data.length > 0) {
    var result = ret.data[0];
    var ret1 = db.selectSqlSync({
      name: 'deviceDB',
      sql: "SELECT * FROM scan WHERE cbarcode='" + barcode + "';"
    });
    if (ret1.status && ret1.data.length > 0) {
      return { status: 2, data: result, msg: '商品已扫描！' };;
    } else {
      var ret2 = db.executeSqlSync({
        name: 'deviceDB',
        sql: "INSERT INTO scan (cbarcode) VALUES ('" + barcode + "');"
      });
      if (ret2.status) {
        return { status: 1, data: result, msg: '扫描成功！' };
      } else {
        return { status: 3, data: result, msg: '扫描失败！' };
      }
    }
  } else {
    return { status: 0, msg: '商品不存在！' };
  }
}

function clearDBCache() {
  var db = api.require('db');
  var ret = db.executeSqlSync({
    name: 'deviceDB',
    sql: "DELETE FROM products;"
  });
  var ret1 = db.executeSqlSync({
    name: 'deviceDB',
    sql: "DELETE FROM scan;"
  });
}

function getScanBarcode() {
  var db = api.require('db');
  var ret = db.selectSqlSync({
    name: 'deviceDB',
    sql: "SELECT * FROM scan;"
  });
  if (ret.status && ret.data.length > 0) {
    return ret.data;
  }
  return [];
}

function getAllData() {
  var db = api.require('db');
  var ret = db.selectSqlSync({
    name: 'deviceDB',
    sql: "SELECT * FROM products;"
  });
  if (ret.status && ret.data.length > 0) {
    return ret.data;
  }
  return [];
}
