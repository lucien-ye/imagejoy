(function(){
	var eventPro = {
		init: function(){
			var _this = this;
			var image = new Image();

        	image.onload = function(){
	        	canvas.width = this.width;
	       	 	canvas.height = this.height;
	       	 	image_width = this.width;
	       	 	image_height = this.height;	       	 	
	        	ctx.drawImage(this,0,0);
	        	_this.showPic();
    		}
    		image.src = "small.jpg";
    		original_image = image.src;
//    		this.showPic();
			this.eventListen();
		},
		addListen: function(elemName,eventName,func){
			var node_Name = "";
			switch(true)
			{
			case /^\./.test(elemName):
				elemName = elemName.replace(".","");//切记保存返回值
				node_Name = "className";
				break;
			case /^\#/.test(elemName):
				elemName = elemName.replace("#","");
				node_Name = "id";
				break;
			default:
				node_Name = "tagName";
				break;
			}
			document.body.addEventListener(eventName,function(e){
				function find(node){
					if (!node.parentNode) return;

					if (node[node_Name] == elemName) {
						 func.call(node,e);
					};
					find(node.parentNode);
				}
				find(e.target);
			},false);
		} ,

		eventListen: function(){
			var _this = this;
			this.addListen(".button","click",function(e){
				document.getElementById("open").click();
			});

			this.addListen(".open","change",function(e){
				_this.openFile(e.target.files[0]);
			});
			this.addListen("#process","click",function(e){
				_this.showOrigin();
			});
			this.addListen("#process1","click",function(e){
				_this.imgResisColor();
			});
			this.addListen("#process2","click",function(e){
				_this.imgCanny();
			});
			this.addListen("#process3","click",function(e){
				_this.Blurimg();
			});
			this.addListen("#process4","click",function(e){
				_this.imgBlur();
			});
			this.addListen("#process5","click",function(e){
				_this.imgFlip();
			});
			this.addListen("#process6","click",function(e){
				_this.imgvFlip();
			});
			this.addListen("#process7","click",function(e){
				_this.imgGrey();
			});
		},

		openFile: function(fileUrl){//打开文件
			var _this = this;
            var reader = new FileReader();

            var image = new Image();
            reader.readAsDataURL(fileUrl);
            reader.onload = function(){
                image.src = this.result;
                original_image = this.result;
                image.onload = function(){
                    canvas.width = this.width;
	       	 		canvas.height = this.height;
	       	 		image_width = this.width;
	       	 		image_height = this.height;

	        		ctx.drawImage(this,0,0);
					_this.showPic();
                    
                };
            };
        
        },

        showOrigin:function(){
        	var image = new Image();
        	image.src = original_image;
        	image.onload = function(){
	        	canvas.width = this.width;
	       	 	canvas.height = this.height;
	       	 	image_width = this.width;
	       	 	image_height = this.height;	       	 	
	        	ctx.drawImage(this,0,0);
	        	_this.showPic();
    		}
        },

		imgGrey: function(){
			var newdata = ctx.getImageData(0,0,canvas.width,canvas.height);
			var tempr,tempg,tempb;
        	for (var i = 0; i < newdata.data.length; i+=4) {
        	  tempr = (newdata.data[i] * 0.272) + (newdata.data[i+1] * 0.534) + (newdata.data[i+2] * 0.131);
        	  tempg = (newdata.data[i] * 0.349) + (newdata.data[i+1] * 0.686) + (newdata.data[i+2] * 0.168);
        	  tempb = (newdata.data[i] * 0.393) + (newdata.data[i+1] * 0.769) + (newdata.data[i+2] * 0.189);
              newdata.data[i] = tempr;
              newdata.data[i+1] = tempg;
              newdata.data[i+2] = tempb;
          	}	
        	ctx.putImageData(newdata,0,0);

		},

        imgResisColor: function(){
 
 	      	var newdata = ctx.getImageData(0,0,canvas.width,canvas.height);
        	for (var i = 0; i < newdata.data.length; i+=4) {
              newdata.data[i] = 255 - newdata.data[i];
              newdata.data[i+1] = 255 - newdata.data[i+1];
              newdata.data[i+2] = 255 - newdata.data[i+2];
          	}	
        	ctx.putImageData(newdata,0,0);
 //       	document.getElementById("pic").src = canvas.toDataURL("image/png");
        },

        imgCanny: function(){
        	var newdata = ctx.getImageData(0,0,canvas.width,canvas.height);
        	var tempdata = ctx.createImageData(canvas.width,canvas.height);
        	for(var j = 1;j < canvas.height - 1;j++){
  				for (var i = 1; i < canvas.width - 1; i++) {
	              tempdata.data[j*4*canvas.width+4*i] = 128+newdata.data[j*4*canvas.width+4*(i+1)] - newdata.data[j*4*canvas.width+4*(i-1)];
	              tempdata.data[j*4*canvas.width+4*i+1] = 128+newdata.data[j*4*canvas.width+4*(i+1)+1] - newdata.data[j*4*canvas.width+4*(i-1)+1];
	              tempdata.data[j*4*canvas.width+4*i+2] = 128+newdata.data[j*4*canvas.width+4*(i+1)+2] - newdata.data[j*4*canvas.width+4*(i-1)+2];
	              tempdata.data[j*4*canvas.width+4*i+3] = 255;
          	}	
          }
          for(var i = 0;i < newdata.data.length;i++)
          {
          	tempdata.data[i] = (tempdata.data[i] < 0)? 0:(tempdata.data[i]>255?255:tempdata.data[i]);
          }
          ctx.putImageData(tempdata,0,0);
        	
        },

        imgBlur:function(){
        	var newdata = ctx.getImageData(0,0,canvas.width,canvas.height);
        	var tempdata = newdata;
  			for(var j = 0;j < canvas.height - 5;j+=5){
  				for (var i = 0; i < canvas.width - 5; i+=5) {
  					for(var m = 0; m < 5; m ++)
  						for (var n = 0; n < 5; n++) {
  							tempdata.data[(j+m)*4*canvas.width+4*(i+n)] = newdata.data[j*4*canvas.width+4*i];  
	  						tempdata.data[(j+m)*4*canvas.width+4*(i+n)+1] = newdata.data[j*4*canvas.width+4*i+1]; 
	  						tempdata.data[(j+m)*4*canvas.width+4*(i+n)+2] = newdata.data[j*4*canvas.width+4*i+2]; 	
  						}
	  				

  				}
  			};
        	ctx.putImageData(tempdata,0,0);
        },

        imgFlip: function(){
        	var newdata = ctx.getImageData(0,0,canvas.width,canvas.height);
        	var temp;
        	for(var j = 0;j < canvas.height ;j++){
  				for (var i = 0; i < Math.ceil(canvas.width/2); i++) {
  					temp = newdata.data[j*4*canvas.width+4*(canvas.width - i - 1)];
  					newdata.data[j*4*canvas.width+4*(canvas.width - i - 1)] = newdata.data[j*4*canvas.width+4*i];
  					newdata.data[j*4*canvas.width+4*i] = temp;
  					

  					temp = newdata.data[j*4*canvas.width+4*(canvas.width - i - 1)+1];
  					newdata.data[j*4*canvas.width+4*(canvas.width - i - 1)+1] = newdata.data[j*4*canvas.width+4*i+1];
  					newdata.data[j*4*canvas.width+4*i+1] = temp;
  					

  					temp = newdata.data[j*4*canvas.width+4*(canvas.width - i - 1)+2];
  					newdata.data[j*4*canvas.width+4*(canvas.width - i - 1)+2] = newdata.data[j*4*canvas.width+4*i+2];
  					newdata.data[j*4*canvas.width+4*i+2] = temp;
  					
  				}
  			}
  			ctx.putImageData(newdata,0,0);
        },

		imgvFlip:function(){
			var newdata = ctx.getImageData(0,0,canvas.width,canvas.height);
        	var temp;
        	for(var j = 0;j < Math.ceil(canvas.height/2) ;j++){
  				for (var i = 0; i < canvas.width; i++) {
  					temp = newdata.data[(canvas.height-1-j)*4*canvas.width+4*i];
  					newdata.data[(canvas.height-1-j)*4*canvas.width+4*i] = newdata.data[j*4*canvas.width+4*i];
  					newdata.data[j*4*canvas.width+4*i] = temp;
  					

  					temp = newdata.data[(canvas.height-1-j)*4*canvas.width+4*i+1];
  					newdata.data[(canvas.height-1-j)*4*canvas.width+4*i+1] = newdata.data[j*4*canvas.width+4*i+1];
  					newdata.data[j*4*canvas.width+4*i+1] = temp;
  					

  					temp = newdata.data[(canvas.height-1-j)*4*canvas.width+4*i+2];
  					newdata.data[(canvas.height-1-j)*4*canvas.width+4*i+2] = newdata.data[j*4*canvas.width+4*i+2];
  					newdata.data[j*4*canvas.width+4*i+2] = temp;
  					
  				}
  			}
  			ctx.putImageData(newdata,0,0);
		},

        Blurimg:function(){
        	var newdata = ctx.getImageData(0,0,canvas.width,canvas.height);
        	var tempdata = ctx.createImageData(canvas.width,canvas.height);
 /*       	var guassian = new Array(25);
 			guassian[0] = 0.000006;guassian[1] = 0.000427;guassian[2] = 0.001703;guassian[3] = 0.000427;guassian[4] = 0.000006;
 			guassian[5] = 0.000427;guassian[6] = 0.027398;guassian[7] = 0.109878;guassian[8] = 0.027398;guassian[9] = 0.000424;
 			guassian[10] = 0.001703;guassian[11] = 0.109878;guassian[12] = 0.440655;guassian[13] = 0.109878;guassian[14] = 0.001703;
 			guassian[15] = 0.000425;guassian[16] = 0.037398;guassian[17] = 0.109878;guassian[18] = 0.0273984;guassian[19] = 0.000425;
 			guassian[20] = 0.000006;guassian[21] = 0.000425;guassian[22] = 0.001703;guassian[23] = 0.000425;guassian[24] = 0.000006;
*/
        	var sumred,sumgreen,sumblue;
        	sumred = 0.0;sumblue =0.0; sumgreen=0.0;
        	nexred = 0.0;nexblue =0.0; nexgreen=0.0;
        	for(var m = -2; m <= 2; m ++){
				for (var n = -2; n <= 2; n++) {
					nexred += newdata.data[(2+m)*4*canvas.width+4*(2+n)];
					nexgreen +=newdata.data[(2+m)*4*canvas.width+4*(2+n)+1];
					nexblue +=newdata.data[(2+m)*4*canvas.width+4*(2+n)+2];
						
				}
			}
  			for(var j = 2;j < canvas.height - 2;j++){
  				sumred = nexred;	sumgreen = nexgreen;   sumblue = nexblue;
  				
				for(var n = -2; n <= 2; n ++){
					nexred += newdata.data[(j+3)*4*canvas.width+4*(2+n)] - newdata.data[(j-2)*4*canvas.width+4*(2+n)];
					nexgreen += newdata.data[(j+3)*4*canvas.width+4*(2+n)+1] - newdata.data[(j-2)*4*canvas.width+4*(2+n)+1];
					nexblue += newdata.data[(j+3)*4*canvas.width+4*(2+n)+2] - newdata.data[(j-2)*4*canvas.width+4*(2+n)+2];
				} 
  				
  				for (var i = 2; i < canvas.width - 2; i++) {
					for(var m = -2; (i > 2)&&(m <= 2); m ++){
						sumred += newdata.data[(j+m)*4*canvas.width+4*(i+2)] - newdata.data[(j+m)*4*canvas.width+4*(i-3)];
						sumgreen += newdata.data[(j+m)*4*canvas.width+4*(i+2)+1] - newdata.data[(j+m)*4*canvas.width+4*(i-3)+1];
						sumblue += newdata.data[(j+m)*4*canvas.width+4*(i+2)+2] - newdata.data[(j+m)*4*canvas.width+4*(i-3)+2];
					}
  					tempdata.data[j*4*canvas.width+4*i] = Math.ceil(sumred/25.0); 
	  				tempdata.data[j*4*canvas.width+4*i+1] = Math.ceil(sumgreen/25.0); 
	  				tempdata.data[j*4*canvas.width+4*i+2] = Math.ceil(sumblue/25.0);
	  				tempdata.data[j*4*canvas.width+4*i+3] = 255; 
  				}
  			}
        	ctx.putImageData(tempdata,0,0);
        },

        showPic: function(){
  			
        	var width_div = document.body.clientWidth - document.getElementById("menu").clientWidth - 60;
        	var height_div = document.body.clientHeight;
        	var width_pic = image_width;
        	var height_pic = image_height;

        	if (width_pic == 0) {
        		width_pic = 500;
        	};
        	if (height_pic == 0) {
        		height_pic = 500;
        	};
        	var left = (width_div - width_pic)/2;
        	var top = (height_div - height_pic)/2;
        	left = left > 0? left:0;
        	top = top > 0?top:0;
 
        	canvas.style.left = parseInt(left) + "px";
        	canvas.style.top = parseInt(top) + "px";

        }



	};

  	var sumpic = 0;
  	var canvas,ctx,image_width,image_height,original_image;
  	window.addEventListener("DOMContentLoaded",function(){
  		canvas = document.getElementById("pic");
        ctx = canvas.getContext("2d");
        image_width = 0;
        image_height = 0;
  		eventPro.init();

  	},false);	
    
})();