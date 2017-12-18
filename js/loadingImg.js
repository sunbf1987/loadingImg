!(function($){
	'use strict';

	//将loadingImg挂载到jq上
	$.extend({
		loadingImg:function(imgs, options){
			new LoadingImg(imgs, options);
		}
	});

	var LoadingImg=function(imgs, options){
		var that=this;
		that.imgs=(typeof imgs==='string') ? [imgs] : imgs; //必须是数组
		that.init(options);
	};

	//初始化调用方法
	LoadingImg.prototype.init=function(options){
		var that=this,
			count=0, //计数器
			imgs=that.imgs,
			len=imgs.length;

		that.opts=$.extend({}, {
			isOrder:false, //是否顺序加载，默认无序
			eachFn:null, //每张图片加载完成 后，调用方法
			allFn:null //所有图片全部加载完毕，调用方法
		}, options); //options覆盖默认值，并生成新的对象

		//调用方法
		if(that.opts.isOrder){
			//有序加载
			orderLoad();
		}else{
			//无序加载
			unOrderLoad();
		};

		var opts=that.opts;

		//有序加载
		function orderLoad(){
			//调用load方法
			load();

			//生成图片加载
			function load(){
				var imgObj=new Image();
				imgObj.src=imgs[count];

				//监听图片加载成功与失败
				$(imgObj).on('load error', function(){
					if(count>=len){
						//全部加载
						opts.allFn&&opts.allFn();
					}else{
						//将当前图片索引传递出去
						opts.eachFn&&opts.eachFn(count);
						//递归循环调用
						load();
					}
					//计数器
					count++;
				});
			};
		};

		//无序加载
		function unOrderLoad(){
			//遍历imgs
			$.each(imgs, function(index, src){
				if(typeof src!='string'){
					//src必须是字符串形式
					console.log('src必须是字符串形式');
					return;
				};

				var imgObj=new Image();
				imgObj.src=src;

				$(imgObj).on('load error', function(){
					//每加载完调用一次方法
					opts.eachFn&&opts.eachFn(count);

					if(count>=len-1){ //全部加载完毕
						opts.allFn&&opts.allFn();
					};

					count++;
				});
			})
		}
		
	};

})(jQuery);