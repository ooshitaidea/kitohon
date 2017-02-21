//	var appKey    = "b8160c6f2e87c4c4f93e7e806d2a39f90c898740892cf4c07268f6dbcd88ec12";	//kitohon appKey
//	var clientKey = "b4d748a05afad17285aef9ffd5ee193f4caaf294d1d26a190dbe439b10ca7088"; //kitohon clientKey
	var appKey    = "15d3db26f75d519ba9273ff34537d248d76ec93a80ce49124d22c176a4e6ef13";	//test appKey
	var clientKey = "737f03998a79931fd2206e7ec21ffd8469342884776b7afff9c35f20c4399e95"; //test clientKey
	var imgsrc = "https://mb.api.cloud.nifty.com/2013-09-01/applications/DEMEzg9N4CIjT27f/publicFiles/"; //test imgurl
	var projectno = "432306700091"; //プロジェクトkey
	var appname = "KITOHON-1.0.0";
	var mailsave = "ahttp://ideaxidea.net/phpmail/index.php?title=";
	var mode = "debug";//debug or ビルド
	var app = angular.module('myApp', ['onsen']);
	var ncmb = new NCMB(appKey, clientKey);
	this.clickEnabled = true;

	var app_data = new Promise(function (resolve, reject) {
	var appdata = ncmb.DataStore("appdata");
        appdata.equalTo('').fetch()
    	.then(function(results) {
			localStorage.setItem('app_time', results.time);
			localStorage.setItem('app_money', results.money);
        });
	}); 

function cancel_check(){
      	
		var currentUser = ncmb.User.getCurrentUser();
		if (currentUser) {
			    user = currentUser.get("userName");
			    objectId = currentUser.get("objectId");
		var now = new Date();
		var jikan= now.getTime();
		var ymd = [];
		ymd.push(now.getFullYear());
		ymd.push(now.getMonth()+1);
		ymd.push(now.getDate());
		day_count = 0;
		var time_old = now.getTime();
				//スキャンして入場
				var Admission_Log = ncmb.DataStore("Admission_Log");
					Admission_Log.fetchAll()
					.then(function(results){
						for (var i = 0; i < results.length; i++) {
							var object = results[i];
							object_id = (object.get("user_id"));
							object_in = (object.get("admission_in"));
							object_out = (object.get("admission_out"));
							object_ymd = (object.get("ymd"));
							object_in_time = (object.get("createDate"));
							logput_name = (object.get("user_name"));
							object_in_time_data = moment(object_in_time).format('HH：mm：ss');
							if(logput_name == user && object_out == ""){
							//ons.notification.alert({title:'',message:"入店時間を読み込みました"});
							$("[id=ad_out]").show();
							$("[id=ad_in]").hide();
							$("[id=sen2]").hide();
							//ons.notification.alert({title:"",message:"入室処理が完了しました。"});
							moneytime = setInterval(function (){

								// 現在のローカル時間が格納された、Date オブジェクトを作成する
								var date_obj = new Date();
							
								// 現在の経過時間
								var time_now = date_obj.getTime();
								// 測定を開始してから経過した時間
								var time = Math.floor((time_now - object_in)/1000);
								var time_f = Math.floor((time_now - object_in)/1000/60);
								var time_j = Math.floor((time_now - object_in)/1000/60/60);
								var time_b = time-(time_f*60);
								var time_f = time_f-(time_j*60);
									time_j = ("0" + time_j).slice(-2);
									time_f = ("0" + time_f).slice(-2);
									time_b = ("0" + time_b).slice(-2);
								// 出力テスト
								money = 400;
								money = money + (Math.floor(time / 5) *100);
								$("[id=ResultMessage_time]").show();
								$('[id=ResultMessage_time]').html("ご来店時間 "+object_in_time_data+"<br><br>ご利用時間 "+time_j+"："+time_f+"："+time_b);
								$("[id=scan_spase]").hide();
								$("[id=log_out]").hide();
								$("[id=scan_spase2]").hide();
								$("[id=ResultMessage]").show();
								$("[id=ResultMessage]").html(user+"様<br>いらっしゃいませ。<br>ごゆっくりお過ごしください。");
								
							},1000/60);
							}
						}
					});
			}
	
}


function onLoginBtn() {
	$('.load').show();
	var username = $("#login_username").val();
	var password = $("#login_password").val();
	if (username == ""){
		ons.notification.alert({title:"ログインエラー",message: 'ユーザ名が入力されていません'});
		$(".load").hide();
		return;
	}else if(password == ""){
		ons.notification.alert({title:"ログインエラー",message: 'パスワードが入力されていません'});
		$(".load").hide();
		return;
	}
    // ユーザー名とパスワードでログイン
	//location.reload();
	ncmb.User.login(username, password)
	.then(function(user) {
		currentLoginUser = ncmb.User.getCurrentUser();
		$(".load").hide();
		$("[id=scan_spase]").show();
		$("[id=scan_spase2]").show();
		$("[id=ad_in]").show();
		$('[id=load_err]').html('');
		$("[id=sen2]").hide();
		appnavi.pushPage('Scan.html');
		$('[id=ad_in]').html("SCAN");
			localStorage.setItem('user_s_id', username);
			localStorage.setItem('user_s_pass', password);
		ons.notification.alert({title:'ログイン完了',message:"ログインしました。"});
	})
	.catch(function(error) {
		$(".load").hide();
		//エラー時の手動エラーチェック
		ncmb.User.fetchAll()
		.then(function(results){
         	var user_on = "";
            for (var i = 0; i < results.length; i++) {
              var object = results[i];
				//alert(object);
				check_Name = (object.get("userName"));
				check_pass = (object.get("userpass"));
				if(check_Name == username){
						ons.notification.alert({title:"ログインエラー",message:"パスワードが違うようです"});
						user_on = "ok";
				}else{
					if(i >= results.length-1 && user_on !== "ok"){
						ons.notification.alert({title:"ログインエラー",message:"ユーザ名が見つかりません"});
					}
				}
            }
          })
         .catch(function(err){
            alert(err);
    			ons.notification.alert({title:"エラー",message: 'NCMBからのパスコードの読み込みができませんでした！'});
          });
	         
	         
	         
		//alert("ログイン失敗！次のエラー発生: " + error);
    	//ons.notification.alert({title:"エラー",message: 'ログイン失敗！再度ログインしてください。'+error});
	    ncmb.User.logout();
	    currentLoginUser = null;
		//appnavi.pushPage('LoginPage.html');
		logincheck();
        });
}

function nyujyo(){
		appnavi.pushPage('Scan.html');
}

 
// 「スキャンする」を押したときに実行される関数
function scanBarcode() {
	
  // BarcodeScannerプラグインを利用してスキャン
  window.plugins.barcodeScanner.scan(
    // 成功時に実行されるコールバック（キャンセル時も含む）
    function(result) {
      // キャンセルされたら何もしない
      if (result.cancelled) {
		ons.notification.alert({title:"キャンセル",message:"スキャンはキャンセルされました"});
        return;
      }
      
      // 結果テキストを表示
      $("[id=ResultMessage]").text(result.text);
      
      // URLなら「ブラウザで開く」ボタンを表示
      if (result.text.indexOf("http") === 0) {
		ons.notification.alert({title:"エラー",message:"こちらのQRコードは登録されていません"});
        //$("#BrowserOpenButton").show();
      } else {
        $("[id=BrowserOpenButton]").hide();
      }
      
      if( result.text.indexOf("入退場") === 0){
        $("[id=ad_in]").hide();
      		
      		age = "";
      		sex = "";
			var currentUser = ncmb.User.getCurrentUser();
			if (currentUser) {
			    user = currentUser.get("userName");
			    kurasu = currentUser.get("userclass");
			    objectId = currentUser.get("objectId");
			    age = currentUser.get("age");
			    sex = currentUser.get("sex");
			}
		var now = new Date();
		var jikan= now.getTime();
		var ymd = [];
		ymd.push(now.getFullYear());
		ymd.push(now.getMonth()+1);
		ymd.push(now.getDate());
		day_count = 0;
		
		var time_old = now.getTime();
				//スキャンして入場
				var Admission_Log = ncmb.DataStore("Admission_Log");
				var admission_log = new Admission_Log();
					admission_log.set("user_name", user)
						.set("user_id", objectId)
						.set("qr_name",result.text)
						.set("admission_in", jikan)
						.set("admission_out","")
						.set("money","")
						.set("money_time",[0,0,0])
						.set("day_count","")
						.set("ymd",ymd)
						.set("user_data",currentUser)
						.set("age",age)
						.set("sex",sex)
						.save()
						.then(function(object) {
							$("[id=ad_out]").show();
							$("[id=ad_in]").hide();
							$("[id=sen2]").hide();
							//ons.notification.alert({title:"",message:"入室処理が完了しました。"});
							moneytime = setInterval(function (){

								// 現在のローカル時間が格納された、Date オブジェクトを作成する
								var date_obj = new Date();
							
								// 現在の経過時間
								var time_now = date_obj.getTime();
								object_in_time_data = moment(time_old).format('HH：mm：ss');
							
								// 測定を開始してから経過した時間
								var time = Math.floor((time_now - time_old)/1000);
								var time_f = Math.floor((time_now - time_old)/1000/60);
								var time_j = Math.floor((time_now - time_old)/1000/60/60);
								var time_b = time-(time_f*60);
								var time_f = time_f-(time_j*60);
									time_j = ("0" + time_j).slice(-2);
									time_f = ("0" + time_f).slice(-2);
									time_b = ("0" + time_b).slice(-2);
									
								// 出力テスト
								money = 400;
								money = money + (Math.floor(time / 5) *100);
								$('[id=ResultMessage_time]').show();
								$('[id=ResultMessage_time]').html("ご来店時間 "+object_in_time_data+"<br><br>ご利用時間 "+time_j+"："+time_f+"："+time_b);
								$("[id=scan_spase]").hide();
								$("[id=scan_spase2]").hide();
								$("[id=log_out]").hide();
								$("[id=ResultMessage]").show();
								$("[id=ResultMessage]").html(user+"様<br>いらっしゃいませ。<br>ごゆっくりお過ごしください。");
								
							},1000/60);
						})
						.catch(function(err){ // エラー処理
								$("[id=ResultMessage]").show();
								$("[id=scan_spase]").hide();
								$("[id=ResultMessage]").hide();
								$("[id=sen2]").hide();
    					    $('[id=load_err]').html('<div class="white_block" onclick="onLogoutBtn()">ログインができていないようです。再度ログインしてください。<br><i class="fa fa-sign-out"></i></div>');
							//$(".load").hide();
						});
      }
    },
    // エラー時に実行されるコールバック
    function(error) {
		$("[id=ResultMessage]").show();
		$("[id=scan_spase]").hide();
		$("[id=ResultMessage]").hide();
		$("[id=ResultMessage]").text(error);
		$("[id=sen2]").hide();
		$('[id=load_err]').html('<div class="white_block" onclick="onLogoutBtn()">ログインができていないようです。再度ログインしてください。<br><i class="fa fa-sign-out"></i></div>');
    }
  );
}
        


 
// 退室用「スキャンする」を押したときに実行される関数
function scanBarcode_out() {
  // BarcodeScannerプラグインを利用してスキャン
  window.plugins.barcodeScanner.scan(
    // 成功時に実行されるコールバック（キャンセル時も含む）
    function(result) {
      // キャンセルされたら何もしない
      if (result.cancelled) {
		ons.notification.alert({title:"エラー",message:"スキャンはキャンセルされました"});
        return;
      }
      
      // 結果テキストを表示
      $("[id=ResultMessage]").text(result.text);
      
      // URLなら「ブラウザで開く」ボタンを表示
      if (result.text.indexOf("http") === 0) {
		ons.notification.alert({title:"エラー",message:"こちらのQRコードは登録されていません"});
        //$("#BrowserOpenButton").show();
      } else {
        $("[id=BrowserOpenButton]").hide();
      }
      
      
      //料金設定を読み込み
		var app_time = localStorage.getItem('app_time');
		var app_money = localStorage.getItem('app_money');
		
		
      if( result.text.indexOf("入退場") === 0){
        $("[id=ad_out]").hide();
      	
			var currentUser = ncmb.User.getCurrentUser();
			if (currentUser) {
			    user_name = currentUser.get("userName");
			    user_id = currentUser.get("objectId");
			}
		var now = new Date();
		var out_time = now.getTime();
		ymd = [];
		ymd.push(now.getFullYear());
		ymd.push(now.getMonth()+1);
		ymd.push(now.getDate());
		day_count = 0;
				//入場時刻をログデータに記録
				var Admission_Log = ncmb.DataStore("Admission_Log");
					Admission_Log.fetchAll()
					.then(function(results){
						for (var i = 0; i < results.length; i++) {
							var object = results[i];
							object_id = (object.get("user_id"));
							object_in = (object.get("admission_in"));
							object_out = (object.get("admission_out"));
							object_ymd = (object.get("ymd"));
							object_in_time = (object.get("createDate"));
							logput_name = (object.get("user_name"));
							 
							//var nownow =new Date(object_in);
							if ( object_id == user_id && object_out ==""){
								$("[id=ad_out]").hide();
								$("[id=log_out]").show();
								$("[id=ad_in]").show();
								$("[id=sen2]").show();
								$("[id=ResultMessage_time]").hide();
								$("[id=ResultMessage]").hide();
								$('[id=ad_in]').html("再度SCANする");
								
								object.set('admission_out', out_time).update();
								out_time_data = moment(out_time).format('MM月DD日HH時mm分ss秒');
								object_in_time = moment(object_in_time).format('MM月DD日HH時mm分ss秒');
								ons.notification.alert({title:"",message:"退室処理が完了しました。詳細画面を開きますのでスタッフにお見せください。"});
								
								clearInterval(moneytime);
								$('[id=logput_in]').html(object_in_time);
								$('[id=logput_out]').html(out_time_data);
								$('[id=logput_name]').html(logput_name);
								//alert("退室："+out_time);
								//alert("入室："+object_in);
								//var time = Math.floor((out_time - object_in)/1000);
								var time_bc = Math.floor((out_time - object_in)/1000);
								var time_fc = Math.floor(time_bc/60);
								var time_jc = Math.floor(time_fc/60);
								
								//alert(time_bc+"-"+time_fc*60+"-"+time_jc*3600);
								var time_b = time_bc - (time_fc*60);
								var time_f = time_fc - (time_jc*60);
								var time_j = time_jc;
								status =  time_j+ '時間'+time_f+"分"+time_b+"秒";
								$('[id=logput_time]').html(status);
								money = app_money;
								money = Number(money) + (Math.floor(time_fc / app_time) *app_money);
								//alert("money"+money+"　Math"+Math.floor(time_fc / app_time)+"　app_money"+app_money+"　time_fc / app_time"+time_fc / app_time);
								object.set('money', money).update();
								money = money.toLocaleString();
								$('[id=logput_money]').html(money);
								object.set('money_time', [time_j,time_f,time_b]).update();
							}
							if (ymd[0] == object_ymd[0] && ymd[1] == object_ymd[1] && ymd[2] == object_ymd[2]){
							//alert(ymd +"と"+object_ymd);
								day_count = day_count+1;
								$('[id=logput_no]').html(day_count+"番");
									day_count2 = ("0" + day_count).slice(-2);
								object.set('day_count', day_count2).update();
							}
						}
					}).catch(function(err){ // エラー処理
								$("[id=ResultMessage]").show();
								$("[id=scan_spase]").hide();
								$("[id=ResultMessage]").hide();
								$("[id=ResultMessage]").html("");
    					    $('[id=load_err]').html('<div class="white_block" onclick="onLogoutBtn()">ログインができていないようです。再度ログインしてください。<br><i class="fa fa-sign-out"></i></div>');
							//$(".load").hide();
					});
      }
      
      
      
    },
    // エラー時に実行されるコールバック
    function(error) {
      $("[id=ResultMessage]").text(error);
    }
  );
}


function kiyaku() {
	appnavi.pushPage('kiyaku.html');
StatusBar.styleLightContent();
}



function RegisterPage() {
	if($("#kiyaku").prop('checked')) {
	    appnavi.pushPage('RegisterPage.html');
	}
	else {
		//appnavi.popPage();
		ons.notification.alert({title:"",message:"同意していただければアプリをご利用になれます"});
	}
	//ons.notification.alert({title:"",message:"アラートです"});

}

//ユーザ登録処理
function onRegisterBtn2() {
	$('[id=tourokumenu]').hide();
	//$('#tourokumemo').html('<h3>登録中...</h3>');

    		//instaID取得
		    //次にinstallationにクラス登録
	var id ="";
    
    var username = $("#reg_username").val();
    var password = $("#reg_password").val();
    
    //var mailAddress = $("#reg_email").val();
    var group = appname;
    
	//$('#tourokumemo').append('ユーザー名とパスワードの入力確認<br />');
    //入力チェック
		$('#regi1').html('');
		$('#regi2').html('');
		$('#regi3').html('');
		$('#regi4').html('');
		$('#regi5').html('');
		er = 0;
	  if(username == ""){
		$('#regi1').append('<span style="color:#EA4335">ユーザー名は必須です</span>');
		$('#tourokumemo').html('<h5>入力項目を再度ご確認ください</h5>');
		er = 1;
	  }
	//ユーザ名重複チェック
		ncmb.User.where({userName: username})
			.limit(1000)
			.fetch()
			.then(function(test) {
			if (test.objectId){
				$('#regi1').append('<span style="color:#EA4335">「'+username+'」このユーザ名はすでに使用されています</span>');
				$('#tourokumemo').html('<h5>入力項目を再度ご確認ください</h5>');
				er = 1;
			}});

	  if(password == ""){
		$('#regi2').append('<span style="color:#EA4335">パスワードは必須です</span>');
		$('#tourokumemo').html('<h5>入力項目を再度ご確認ください</h5>');
		er = 1;
	  }
	  if (er == 1){
			$('#tourokumenu').show();
    			return;
	  	
	  }
	
	//ユーザー登録処理
	var acl = new ncmb.Acl();
	acl.setPublicReadAccess(true); //全員への読み込み権限を許可
	acl.setPublicWriteAccess(true); //全員への書き込み権限を許可
    var user = new ncmb.User();
    user.set("userName", username)
        .set("password", password)
        .set("userpass", password)
        .set("sex", undefined)
        .set("age", "")
        .set("group", group)
    	.set("acl",acl); // aclを設定
    
	//$('#tourokumemo').append('ユーザー情報をデータベースに登録中<br />');
    // 任意フィールドに値を追加 
    user.signUpByAccount()
        .then(function(user) {
			//$('#tourokumemo').append('アプリ情報の初期化中<br />');
            //カレントユーザー登録
    		ncmb.User.login(username, password);
            currentLoginUser = ncmb.User.getCurrentUser();
		    
		    
			//appnavi.pushPage('Scan.html');
			appnavi.pushPage('RegisterPage2.html');
			//$('#tourokumemo').append('登録完了<br />');
		    ons.notification.alert({title:"ユーザ登録",message:"登録が完了しました。"});
				localStorage.setItem('user_s_id', username);
				localStorage.setItem('user_s_pass', password);
				$("#login_username").val(username);
				$("#login_password").val(password);
				//location.reload();
			$('#tourokumenu').show();
        })
        .catch(function(error) {
		    		ons.notification.alert({title:"登録失敗",message:"新規登録に失敗！次のエラー発生：" + error});
			$('#tourokumenu').show();
        });
				
				
				//メール重複チェック〆
//			}
//		})
//         .catch(function(err){
//			ons.notification.alert({title:group,message:"メール重複チェック中にエラー" + err});
//		});
        
        
        
}

function opsion_btn(){
    var sex = $("input[name='opsion_sex']:checked").val();
    var age = $("#opsion_age").val();
	var currentUser = ncmb.User.getCurrentUser();
	if (currentUser) {
		naiyou="";
		if(age !== "" && sex !== ""){
			currentUser.set('age', age)
						.set('sex', sex).update()
			.then(function() {
				naiyou += age;
				naiyou += sex;
					ons.notification.alert({title:'設定変更',message:naiyou+"に変更されました"});
					appnavi.pushPage('Scan.html');
			});
		}else{
			ons.notification.alert({title:'エラー',message:"項目がすべて入力されていません"});
		}
	}
}
function opsion_skip(){
	ons.notification.alert({title:'スキップします',message:"設定は「設定変更」からいつでも設定できます。"});
	appnavi.pushPage('Scan.html');
}


//ユーザ編集ページ
function edit() {
	logincheck();
	//alert("アップデートok");
	appnavi.pushPage('edit.html');
	var currentUser = ncmb.User.getCurrentUser();
	if (currentUser) {
		user = currentUser.get("userName");
		age = currentUser.get("age");
		sex = currentUser.get("sex");
			currentUser.set('opsion', '設定済み').update()
			.then(function() {
				$('#c_name').val(user);
				$('[name=c_sex]').val([sex]);
				$('#c_age').val(age);
			});
		
	}
	
}
	//現在の設定を適用
		$(document).on('pageinit',function(){
		});
function c_btn(){
	logincheck();
	var currentUser = ncmb.User.getCurrentUser();
	if (currentUser) {
	    user = currentUser.get("userName");
	    userpass = currentUser.get("userpass");
	    age = currentUser.get("age");
	    sex = currentUser.get("sex");
		c_age = $("#c_age option:selected").text();
		c_sex = $("[name=c_sex]:checked").val();
			currentUser.age = c_age;
			currentUser.sex = c_sex;
		naiyou="";
		if(age !== c_age || sex !== c_sex){
			currentUser.set('age', c_age).update()
			.then(function() {
				naiyou += c_age;
				if(c_sex !== undefined){
					naiyou += c_sex;
				}
			    ncmb.User.logout();
			    currentLoginUser = null;
				ncmb.User.login(user, userpass)
				.then(function(user) {
					currentLoginUser = ncmb.User.getCurrentUser();
					$("#age_txt").html(c_age+"に変更されました。");
					ons.notification.alert({title:'設定変更',message:naiyou+"に変更されました"});
					appnavi.popPage();
				});
			});
		}else{
			ons.notification.alert({title:'エラー',message:"項目がすべて入力されていません"});
		}
	}
}

//ログアウト処理
function onLogoutBtn() {
	$('#kanri_menu').hide();
	//ncmb.User.login("damy", "damy");
    ncmb.User.logout();
	ons.notification.alert({title:'ログアウト',message:"正常にログアウトが完了しました。"});
    currentLoginUser = null;
    //$.mobile.changePage('#LoginPage');
    //appnavi.popPage('LoginPage.html');
    appnavi.pushPage('LoginPage.html');
    
    $(window).load(function(){
	$('[id=ver]').html(appname);
});
}

function firstCtrl($scope){$scope.data = appname;};
///// 初期読み込み
function onReady() {
	//onsenui読み込み
        ons.bootstrap();
	
		//$('#karenda').hide();
		$("#karenda").addClass("no_vew");
		$(".load").hide();
	//ログインログが残っていれば自動ログイン
	var currentUser = ncmb.User.getCurrentUser();
	if (currentUser) {
		var user_s_id = localStorage.getItem('user_s_id');
		var user_s_pass = localStorage.getItem('user_s_pass');
		ncmb.User.login(user_s_id, user_s_pass)
			.then(function() {
				logincheck();
			    cancel_check();
				appnavi.pushPage('Scan.html');
			})
			.catch(function(error) {
				appnavi.pushPage('LoginPage.html');
			});
	} else {
				appnavi.pushPage('LoginPage.html');
				$(".load").hide();
				$("#scan_spase").show();
				$("#ad_in").show();
				$('[id=load_err]').html('');
				$("#sen2").hide();
				appnavi.pushPage('Scan.html');
				$('#ad_in').html("SCAN");
			    cancel_check();
	}
	//高さ取得
	$(document).ready(function () {
StatusBar.styleLightContent();
		hsize = $(window).height();
		$("[id=v_height]").css("height", hsize + "px");
		$("[id=h_height]").css("height", hsize + "px");
	});
}
function test_btn(){
			localStorage.setItem('user_s_id', "");
			localStorage.setItem('user_s_pass', "");
			alert("クリア");
}
//ログインcheck
function logincheck(){
	var Admission_Log = ncmb.DataStore("Admission_Log");
	Admission_Log.limit(1000).fetchAll()
	.catch(function(err){
		var user_s_id = localStorage.getItem('user_s_id');
		var user_s_pass = localStorage.getItem('user_s_pass');
		ncmb.User.login(user_s_id, user_s_pass)
		.then(function() {
			ons.notification.alert({title:'読み込み完了',message:"読み込みが完了しました。"});
			currentLoginUser = ncmb.User.getCurrentUser();
			age = currentLoginUser.get("age");
			sex = currentLoginUser.get("sex");
			$(".load").hide();
			$("#scan_spase").show();
			$("#ad_in").show();
			$('[id=load_err]').html('');
			$("#sen2").hide();
			appnavi.pushPage('Scan.html');
			$('#ad_in').html("SCAN");
			cancel_check();
		}).catch(function(error) {
			// エラー処理
			$(".load").hide();
				appnavi.pushPage('LoginPage.html');
			$('[id=load_err]').html('<div class="white_block" onclick="onLogoutBtn()">読込できません！再度ログインしてください<br><i class="fa fa-sign-out"></i></div>');
			ncmb.User.logout();
			currentLoginUser = null;
			$('[id=ver]').html(appname);
		});
	});
}

$(onReady); // on DOMContentLoaded


