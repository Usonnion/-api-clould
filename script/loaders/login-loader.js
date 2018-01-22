/**
 * Created by Administrator on 2017-08-18.
 */


var LoginLoader = {
  login: function (param, success) {
    // requestDatas(loginUrl, param, function(data){
    //     setRequestStorage(loginUrl, param);
    //     setResponseStorage(loginUrl, data);
    //     success(data);
    // });
    api.showProgress();
    const result = checkUserLoginFromDB(param.username, param.password);
    if (result) {
      $api.setStorage("loginInfo", JSON.stringify(result));
      success(result);
    } else {
      api.toast({ msg: '用户名或密码不正确' });
    }
    api.hideProgress();
  },

  getLoginUserInfo: function () {
    var userInfo = $api.getStorage("loginInfo") ? JSON.parse($api.getStorage("loginInfo")) : {};
    return userInfo;
  },

  resetLoginUserInfo: function () {
    $api.setStorage("loginInfo", '');
  }
}

var loginLoader = Object.create(LoginLoader);