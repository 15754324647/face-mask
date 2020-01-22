//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res)
        //获取登录的临时凭证
        var code = res.code;
        //调用后端，获取微信的session_key,secret
        wx.request({
          url: 'http://192.168.1.106:8080/login/wxLogin?code=' + code,
          method: "POST",
          success: function (result) {

            //用户授权前置条件为用户登录
            console.log(result);
            
            // 获取用户信息
            wx.getSetting({
              success: res => {
                console.log("获取用户信息");
                if (res.authSetting['scope.userInfo']) {
                  //回调函数this不生效
                  var that = this;
                  // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                  wx.getUserInfo({
                    success: function (res) {
                      console.log("获取用户信息获取成功");
                      
                      // 可以将 res 发送给后台解码出 unionId
                      that.globalData.userInfo = res.userInfo

                      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                      // 所以此处加入 callback 以防止这种情况
                      if (that.userInfoReadyCallback) {
                        that.userInfoReadyCallback(res)
                      }
                    }
                  })
                } else {
                  // 未授权，跳转到授权页面
                  wx.reLaunch({
                    url: '../mask/mask',
                  })
                }
              }
            })
          }
        })
      }
    })  
  },
  globalData: {
    userInfo: null,
    bgPic:null,
    scale:1,
    rotate:0,
    hat_center_x:0,
    hat_center_x:0,
    currentHatId:1
  }
})