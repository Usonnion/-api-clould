/**
 * debugMode
 * 配置debug模式，正式发布时需要关闭debug模式（修改为false）
 */
var debugMode = false;
/**
 * serverUrl
 * 配置服务器地址
 * @type {string}
 */

// var serverUrl = "http://" + $api.getStorage('ip') + ":" + $api.getStorage('port') + "/eap1.0/phone";//'http://10.60.1.27:8080';  zytech7  zenyu
var serverUrl = "http://10.60.1.60:8080/barcode";//'http://10.60.1.27:8080';  zytech7  zenyu

/**
 * APIs
 * 所有的接口配置
 */
var APIs = {};

/**
 * setRequestStorage
 * 记忆接口请求参数
 * @param apiName 接口名称
 */
function setRequestStorage(apiName, param) {
  $api.setStorage(apiName, param);
}
/**
 * getRequestStorage
 * 获取记忆的接口请求参数
 * @param apiName 接口名称
 */
function getRequestStorage(apiName) {
  return $api.getStorage(apiName);
}
/**
 * clearRequestStorage
 * 清除记忆的接口请求参数
 * @param apiName 接口名称
 */
function clearRequestStorage(apiName) {
  $api.rmStorage(apiName);
}
/**
 * clearAllRequestStorage
 * 清除所有记忆的接口请求参数
 */
function clearAllRequestStorage() {
  for (key in APIs) {
    $api.rmStorage(APIs[key].name);
  }
}

/**
 * setRequestStorage
 * 记忆接口返回参数
 * @param apiName 接口名称
 * @param datas 接口名称
 */
function setResponseStorage(apiName, datas) {
  $api.setStorage(apiName + "_response", datas);
}
/**
 * getRequestStorage
 * 获取记忆的接口返回参数
 * @param apiName 接口名称
 */
function getResponseStorage(apiName) {
  return $api.getStorage(apiName + "_response");
}
/**
 * clearRequestStorage
 * 清除记忆的接口返回参数
 * @param apiName 接口名称
 */
function clearResponseStorage(apiName) {
  $api.rmStorage(apiName + "_response");
}
/**
 * clearAllRequestStorage
 * 清除所有记忆的接口返回参数
 */
function clearAllResponseStorage() {
  for (key in APIs) {
    $api.rmStorage(APIs[key].name + "_response");
  }
}

/**
 * requestDatas(url, param)
 * ajax网络请求
 * @param url 网址
 * @param param 请求参数
 * @returns {string} 返回的结果
 */
function requestDatas(url, param, success, withoutLoading) {
  if (typeof param == 'string') {
    param = JSON.parse(param);
  }

  jQuery.ajax({
    url: serverUrl + url,
    type: "post",
    async: true,
    timeout: "20000",
    data: param,
    success: function (data) {
      if (data.status == '1') {
        if (! isEmpty(data.msg)) {
          alert(data.msg);
          // api.toast({ msg: data.msg });
        }
        success(data.data);
      } else {
        api.hideProgress();
        alert(data.msg);
        // api.toast({ msg: data.msg });
      }
      return;
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      api.hideProgress();
      api.toast({ msg: '抱歉，请检测网络连接' });
      return;
    }
  });
}
/**
 * 调试信息
 * @param msg
 */
function debugMsg(msg) {
  if (debugMode) {
    api.alert({
      msg: msg
    });
    console.log(msg);
  }
}
function debugMsgRsp(msg) {
  if (debugMode) {
    api.alert({
      msg: '已返回：' + msg
    });
    console.log('已返回：' + msg);
  }
}
function debugMsgReq(msg) {
  if (debugMode) {
    api.alert({
      msg: '将发送：' + msg
    });
    console.log('将发送：' + msg);
  }
}

function openWindow(name, path, param) {
  api.openWin({
    name: name,
    url: path,
    animation: {
      type: "none"
    },
    pageParam: {
      param: param
    },
    reload: true,
    rect: {
      x: 0,
      y: 0,
      w: 'auto',
      h: 'auto'
    },
    bounces: false
  });
}

function closeWinByDelay(win) {
  setTimeout("close(" + win + ")", 300);
}

function closeWinImmediate(win) {
  close(win);
}

function close(win) {
  api.closeWin({
    name: win,
    animation: {
      type: "none"
    }
  });
}
function closeToWindow(win) {
  api.closeToWin({
      name: win,
      animation: {
        type: "none"
      }
    }
  );
}

function stopEventChain() {
  var e = arguments.callee.caller.arguments[0] || window.event;
  window.event ? e.cancelBubble = true : e.stopPropagation();
}

function call(number) {
  if (! number) {
    number = "";
  }
  api.prompt({
    title: "请输入电话号码",
    text: number,
    buttons: ["打电话", "发短信", "取消"]
  }, function (ret, err) {
    var numer = ret.text || "";

    if (1 == ret.buttonIndex) {
      api.call({
        number: numer
      });
    }

    if (2 == ret.buttonIndex) {
      api.sms({
        numbers: [numer],
        text: ""
      });
    }
  });
  stopEventChain();
}

Date.prototype.Format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1,                 //月份
    "d+": this.getDate(),                    //日
    "h+": this.getHours(),                   //小时
    "m+": this.getMinutes(),                 //分
    "s+": this.getSeconds(),                 //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds()             //毫秒
  };
  if (/(y+)/.test(fmt))
    fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};
//选择日期
function showDatePicker(callback) {
  api.openPicker({
    type: 'date',
    date: 'yyyy-MM-dd HH:mm',
    title: '选择时间'
  }, function (ret, err) {
    var date;
    if (ret) {
      date = new Date(ret.year, ret.month - 1, ret.day).Format("yyyy-MM-dd");
      callback(date);
    } else {
      alert(JSON.stringify(err));
    }
  });
}
//选择时间
function showTimePicker(callback) {
  api.openPicker({
    type: 'time',
    date: 'yyyy-MM-dd HH:mm',
    title: '选择时间'
  }, function (ret, err) {
    var time;
    if (ret) {
      time = new Date(ret.year, ret.month - 1, ret.day, ret.hour, ret.minute, 0).Format("hh:mm");
      callback(time);
    } else {
      alert(JSON.stringify(err));
    }
  });
}
//选择日期和时间
function showDateTimePicker(callback) {
  api.openPicker({
    type: 'date',
    date: 'yyyy-MM-dd HH:mm',
    title: '选择时间'
  }, function (ret, err) {
    if (ret) {
      api.openPicker({
        type: 'time',
        date: ret.year + '-' + ret.month - 1 + '-' + ret.day + ' ' + ret.hour + ':' + ret.minute,
        title: '选择时间'
      }, function (ret2, err) {
        var dateTime;
        if (ret2) {
          dateTime = new Date(ret.year, ret.month - 1, ret.day, ret2.hour, ret2.minute, 0).Format("yyyy-MM-dd hh:mm");
          callback(dateTime);
        } else {
          alert(JSON.stringify(err));
        }
      });
    } else {
      alert(JSON.stringify(err));
    }
  });
}

function graceStr(str) {
  if (str == "" || str == null || str == undefined) {
    return "";
  } else {
    return str;
  }
}

var eventList = {
  orderDetailRefresh: 'orderDetailRefresh'
}

/**
 * trans2TreeDate(orgList, orgIdStr, orgPidStr, orgText)
 * 将数据转换成bootstrap-tree需要的数据结构
 * @param orgList 数组
 * @param orgIdStr 源节点ID字段名
 * @param orgPidStr 源父节ID字段名
 * @param orgText 源节点名称
 * @returns {Array}
 */
function trans2TreeData(orgList, orgIdStr, orgPidStr, orgText) {
  var templist = [];
  for (i = 0; i < orgList.length; i ++) {
    var t = {};
    t.id = orgList[i][orgIdStr];
    t.pid = orgList[i][orgPidStr];
    t.text = orgList[i][orgText];
    t.tags = [">"];
    templist.push(t);
  }

  var result = [], temp = {};
  for (i = 0; i < templist.length; i ++) {
    temp[templist[i].id] = templist[i];
  }
  for (j = 0; j < templist.length; j ++) {
    tempP = temp[templist[j].pid];
    if (tempP) {
      ! tempP['nodes'] && (tempP['nodes'] = []);
      tempP['nodes'].push(templist[j]);
    } else {
      result.push(templist[j]);
    }
  }
  return result;
}

function isNull(data) {
  return data == 'none' || data == null || data == "";
}

/**
 * Bundle对象:页面之间传递数据的媒介
 */
var Bundle = {
  thisWinName: "",        //窗口名称
  thisFrmName: "",        //页面名称
  callbackFunName: "",    //回调函数名称
  data: {}                //数据
};

var cuXiaoClassMapping = {
  '001': 'label-dazhe',
  '002': 'label-mamjian',
  '003': 'label-yikoujia',
  '004': 'label-manzeng',
}

function afterYesterday(date) {
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDay() - 1);
  return date > yesterday;
}

function isEmpty(str) {
  if (! str || str == undefined || str.length == 0) {
    return true;
  }
  return false;
}

function mergeObject(fromObject, toObject) {
  if (fromObject && fromObject) {
    Object.keys(fromObject).map(function (key) {
      toObject[key] = fromObject[key];
    });
  }
  return toObject;
}

function buildFileUrl(file) {
  return rootUrl + file.path + '/' + file.name;
}

function renderCommonKeyValueCell(key, value) {
  return '<li class="aui-list-item">' +
    '<div class="aui-list-item-inner">' +
    '<div class="aui-list-item-title aui-text-secondary">' + key + '</div>' +
    '<div class="aui-padded-r-10">' + value + '</div>' +
    '</div>' +
    '</li>';
}

function closeWindow(win) {
  // setTimeout("close("+win+")",300);
  setTimeout(function () {
    close(win);
  }, 300);
}
