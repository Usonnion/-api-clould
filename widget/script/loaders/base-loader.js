/**
 * Created by Administrator on 2017-08-18.
 */

var BaseLoader = {
    loadData: function (url, param, success) {
        if (typeof param == 'string') {
            param = JSON.parse(param);
        }
        jQuery.ajax({
            url: url,
            type: "post",
            async: true,
            timeout: "20000",
            data: param,
            beforeSend: function () {
                api.showProgress();
            },
            complete: function () {
                api.hideProgress();
                api.refreshHeaderLoadDone();
            },
            success: function (data) {
                if (! data) {
                    api.toast({msg: data});
                    return;
                }
                data = JSON.parse(data);
                if (data.status === 'success') {
                    success(data);
                } else {
                    api.toast({msg: data.message});
                }
                return;
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                api.toast({msg: '抱歉，请稍后再试'});
                return;
            }
        });
    }
}
