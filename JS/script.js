/*$(document).ready(function(){
$('.aboutme').hover(
    function(){
    $(this).css('color','#19fbff').css('border','2px solid #19fbff');
     $(this).fadeOut(500);
},
    function(){
        
        $(this).fadeIn(500);$(this).css('color','antiquewhite').css('border','1px solid antiquewhite');
    }
);


$('.exp').hover(
    function(){
    $(this).css('color','#f92f94').css('border','2px solid #f92f94');
    $(this).fadeOut(500);
    },
    function(){
       $(this).fadeIn(500); $(this).css('color','antiquewhite').css('border','1px solid antiquewhite');
    }
);


$('.works').hover(
    function(){
    $(this).css('color','#fff605').css('border','2px solid #fff605');
    $(this).fadeOut(500);
    },
    function(){
       $(this).fadeIn(500); $(this).css('color','antiquewhite').css('border','1px solid antiquewhite');
    }
);

$('.skill').hover(
    function(){
    $(this).css('color','#00ff37').css('border','2px solid #00ff37');
    $(this).fadeOut(500);
    },
    function(){
        $(this).fadeIn(500);$(this).css('color','antiquewhite').css('border','1px solid antiquewhite');
    }
);

$('.FBicon').hover(
    function(){
    $(this).css('width','72px').css('height','72px');
    $(this).fadeOut(500);
    },
    function(){
      $(this).fadeIn(500);  $(this).css('width','70px').css('height','70px');
    }
);
$('.IGicon').hover(
    function(){
    $(this).css('width','72px').css('height','72px');$(this).fadeOut(500);
    },
    function(){
        $(this).css('width','70px').css('height','70px');$(this).fadeIn(500);
    }
);


});*/
$(document).ready(function(){
blackhole('#blackhole');



function blackhole(element) {
	var h = $(element).height(),
	    w = $(element).width(),
	    cw = w,
	    ch = h,
	    maxorbit = 255, // distance from center
	    centery = ch/2,
	    centerx = cw/2;

	var startTime = new Date().getTime();
	var currentTime = 0;

	var stars = [],
	    collapse = false, // if hovered
	    expanse = false; // if clicked

	var canvas = $('<canvas/>').attr({width: cw, height: ch}).appendTo(element),
	    context = canvas.get(0).getContext("2d");

	context.globalCompositeOperation = "multiply";

	function setDPI(canvas, dpi) {
		// Set up CSS size if it's not set up already
		if (!canvas.get(0).style.width)
			canvas.get(0).style.width = canvas.get(0).width + 'px';
		if (!canvas.get(0).style.height)
			canvas.get(0).style.height = canvas.get(0).height + 'px';

		var scaleFactor = dpi / 96;
		canvas.get(0).width = Math.ceil(canvas.get(0).width * scaleFactor);
		canvas.get(0).height = Math.ceil(canvas.get(0).height * scaleFactor);
		var ctx = canvas.get(0).getContext('2d');
		ctx.scale(scaleFactor, scaleFactor);
	}

	function rotate(cx, cy, x, y, angle) {
		var radians = angle,
		    cos = Math.cos(radians),
		    sin = Math.sin(radians),
		    nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
		    ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
		return [nx, ny];
	}

	setDPI(canvas, 192);

	var star = function(){

		// Get a weighted random number, so that the majority of stars will form in the center of the orbit
		var rands = [];
		rands.push(Math.random() * (maxorbit/2) + 1);
		rands.push(Math.random() * (maxorbit/2) + maxorbit);

		this.orbital = (rands.reduce(function(p, c) {
			return p + c;
		}, 0) / rands.length);
		// Done getting that random number, it's stored in this.orbital

		this.x = centerx; // All of these stars are at the center x position at all times
		this.y = centery + this.orbital; // Set Y position starting at the center y + the position in the orbit

		this.yOrigin = centery + this.orbital;  // this is used to track the particles origin

		this.speed = (Math.floor(Math.random() * 2.5) + 1.5)*Math.PI/180; // The rate at which this star will orbit
		this.rotation = 0; // current Rotation
		this.startRotation = (Math.floor(Math.random() * 360) + 1)*Math.PI/180; // Starting rotation.  If not random, all stars will be generated in a single line.  

		this.id = stars.length;  // This will be used when expansion takes place.

		this.collapseBonus = this.orbital - (maxorbit * 0.7); // This "bonus" is used to randomly place some stars outside of the blackhole on hover
		if(this.collapseBonus < 0){ // if the collapse "bonus" is negative
			this.collapseBonus = 0; // set it to 0, this way no stars will go inside the blackhole
		}

		stars.push(this);
		this.color = 'rgba(255,255,255,'+ (1 - ((this.orbital) / 255)) +')'; // Color the star white, but make it more transparent the further out it is generated

		this.hoverPos = centery + (maxorbit/2) + this.collapseBonus;  // Where the star will go on hover of the blackhole
		this.expansePos = centery + (this.id%100)*-10 + (Math.floor(Math.random() * 20) + 1); // Where the star will go when expansion takes place


		this.prevR = this.startRotation;
		this.prevX = this.x;
		this.prevY = this.y;

		// The reason why I have yOrigin, hoverPos and expansePos is so that I don't have to do math on each animation frame.  Trying to reduce lag.
	}
	star.prototype.draw = function(){
		// the stars are not actually moving on the X axis in my code.  I'm simply rotating the canvas context for each star individually so that they all get rotated with the use of less complex math in each frame.



		if(!expanse){
			this.rotation = this.startRotation + (currentTime * this.speed);
			if(!collapse){ // not hovered
				if(this.y > this.yOrigin){
					this.y-= 2.5;
				}
				if(this.y < this.yOrigin-4){
					this.y+= (this.yOrigin - this.y) / 10;
				}
			} else { // on hover
				this.trail = 1;
				if(this.y > this.hoverPos){
					this.y-= (this.hoverPos - this.y) / -5;
				}
				if(this.y < this.hoverPos-4){
					this.y+= 2.5;
				}
			}
		} else {
			this.rotation = this.startRotation + (currentTime * (this.speed / 2));
			if(this.y > this.expansePos){
				this.y-= Math.floor(this.expansePos - this.y) / -140;
			}
		}

		context.save();
		context.fillStyle = this.color;
		context.strokeStyle = this.color;
		context.beginPath();
		var oldPos = rotate(centerx,centery,this.prevX,this.prevY,-this.prevR);
		context.moveTo(oldPos[0],oldPos[1]);
		context.translate(centerx, centery);
		context.rotate(this.rotation);
		context.translate(-centerx, -centery);
		context.lineTo(this.x,this.y);
		context.stroke();
		context.restore();


		this.prevR = this.rotation;
		this.prevX = this.x;
		this.prevY = this.y;
	}


	$('.centerHover').on('click',function(){
		collapse = false;
		expanse = true;

		$(this).addClass('open');
		$('.fullpage').addClass('open');
		setTimeout(function(){
			$('.header .welcome').removeClass('gone');
		}, 500);
	});
	$('.centerHover').on('mouseover',function(){
		if(expanse == false){
			collapse = true;
		}
	});
	$('.centerHover').on('mouseout',function(){
		if(expanse == false){
			collapse = false;
		}
	});

	window.requestFrame = (function(){
		return  window.requestAnimationFrame       ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame    ||
			function( callback ){
			window.setTimeout(callback, 1000 / 60);
		};
	})();

	function loop(){
		var now = new Date().getTime();
		currentTime = (now - startTime) / 50;

		context.fillStyle = 'rgba(25,25,25,0.2)'; // somewhat clear the context, this way there will be trails behind the stars 
		context.fillRect(0, 0, cw, ch);

		for(var i = 0; i < stars.length; i++){  // For each star
			if(stars[i] != stars){
				stars[i].draw(); // Draw it
			}
		}

		requestFrame(loop);
	}

	function init(time){
		context.fillStyle = 'rgba(25,25,25,1)';  // Initial clear of the canvas, to avoid an issue where it all gets too dark
		context.fillRect(0, 0, cw, ch);
		for(var i = 0; i < 2500; i++){  // create 2500 stars
			new star();
		}
		loop();
	}
	init();
}
$('.mouse').hide();
$('.test1').hide();
$('.test4').hide();
$('.test4-2').hide();
$('.page2').hide();
$('footer').hide();
//
//
//
//$('.centerHover').hide();
//			$('#blackhole').hide();
//			$('.The').hide();
//			$('.In').hide();
//			$('.Mystery').hide();
//			$('.Biggest').hide();
//			$('.blht').hide();
//			$('.World').hide();
//			$('.mouse').hide(); 
//			$('html').css('overflow-y','scroll');
//
//
//

$('.centerHover').click(
    function(){
		$('.test1').fadeIn(2000);
		$('.test4-2').fadeIn(100);
		$('html').css('overflow-y','scroll');
		
		$('.test1').css('font-size','30px');
		$('.test4').fadeIn(500);
		$('.test4').css('transform','scale(5)');
		$('.test4').delay(3500).fadeOut(0);
		$('.mouse').delay(2500).fadeIn(500);
		$('html,body').animate({scrollTop: '0px'} , 0)
	}
	//$('').click(
	//	function(){
			
	//	});	
		
    
);
$('.continue').click(
	function(){
		$('.centerHover').hide();
			$('#blackhole').hide();
			$('.The').hide();
			$('.In').hide();
			$('.Mystery').hide();
			$('.Biggest').hide();
			$('.blht').hide();
			$('.World').hide();
			$('.mouse').hide();
				$('html,body').animate({scrollTop: '0px'} , 0)
			$('.page2').show();
			$('footer').show();
			$('.continue').hide();
			$('body').css('height','3000px');
	}
)
$('.contr').hover(
	function(){
		$('.bkh').css('opacity','1');
		$('.spr').css('transform','rotateZ(35765deg)');
		$('.spr2').css('transform','rotateX(75deg)');
		$('.bkh').css('transform','rotateX(-75deg)');
		$('.sq1').css('width','10px').css('height','10px');
		$('.sq2').css('width','10px').css('height','10px');
		$('.sq3').css('width','10px').css('height','10px');
		$('.sq4').css('width','10px').css('height','10px');
		$('.sq5').css('width','10px').css('height','10px');
		$('.sq6').css('width','10px').css('height','10px');
		$('.sq7').css('width','10px').css('height','10px');
		$('.sq8').css('width','10px').css('height','10px');
		$('.sq9').css('width','10px').css('height','10px');
		$('.sq10').css('width','10px').css('height','10px');
		$('.sq11').css('width','10px').css('height','10px');
		$('.sq12').css('width','10px').css('height','10px');
		$('.sq13').css('width','10px').css('height','10px');
		$('.sq14').css('width','10px').css('height','10px');
		$('.sq15').css('width','10px').css('height','10px');
		$('.sq16').css('width','10px').css('height','10px');
		$('.sq17').css('width','10px').css('height','10px');
		$('.sq18').css('width','10px').css('height','10px');
		$('.sq19').css('width','10px').css('height','10px');
		$('.sq20').css('width','10px').css('height','10px');
		$('.sq21').css('width','10px').css('height','10px');
		$('.sq22').css('width','10px').css('height','10px');
		$('.sq23').css('width','10px').css('height','10px');
		$('.sq24').css('width','10px').css('height','10px');
		$('.sq25').css('width','10px').css('height','10px');
		$('.sq26').css('width','10px').css('height','10px');
		$('.sq27').css('width','10px').css('height','10px');
		$('.sq28').css('width','10px').css('height','10px');
		$('.sq29').css('width','10px').css('height','10px');
		$('.sq30').css('width','10px').css('height','10px');
		$('.sq31').css('width','10px').css('height','10px');
		TweenMax.to('.sq1',1,{x:0,y:0});
		TweenMax.to('.sq2',1,{x:0,y:100});
		TweenMax.to('.sq3',1,{x:100,y:0});
		TweenMax.to('.sq4',1,{x:100,y:100});
		TweenMax.to('.sq5',1,{x:-50,y:0});
		TweenMax.to('.sq6',1,{x:-30,y:10});
		TweenMax.to('.sq7',1,{x:10,y:50});
		TweenMax.to('.sq8',1,{x:120,y:0});
		TweenMax.to('.sq9',1,{x:-10,y:30});
		TweenMax.to('.sq10',1,{x:90,y:100});
		TweenMax.to('.sq11',1,{x:130,y:130});
		TweenMax.to('.sq12',1,{x:-30,y:86});
		TweenMax.to('.sq13',1,{x:77,y:80});
		TweenMax.to('.sq14',1,{x:-45,y:55});
		TweenMax.to('.sq15',1,{x:33,y:57});
		TweenMax.to('.sq16',1,{x:50,y:139});
		TweenMax.to('.sq17',1,{x:39,y:168});
		TweenMax.to('.sq18',1,{x:-27,y:33});
		TweenMax.to('.sq19',1,{x:50,y:10});
		TweenMax.to('.sq20',1,{x:-10,y:135});
		TweenMax.to('.sq21',1,{x:70,y:60});
		TweenMax.to('.sq22',1,{x:-50,y:90});
		TweenMax.to('.sq23',1,{x:60,y:-50});
		TweenMax.to('.sq24',1,{x:45,y:-80});
		TweenMax.to('.sq25',1,{x:-70,y:-60});
		TweenMax.to('.sq26',1,{x:60,y:60});
		TweenMax.to('.sq27',1,{x:36,y:36});
		TweenMax.to('.sq28',1,{x:59,y:68});
		TweenMax.to('.sq29',1,{x:66,y:66});
		TweenMax.to('.sq30',1,{x:33,y:33});
		TweenMax.to('.sq31',1,{x:33,y:66});
	},function(){
		$('.bkh').css('opacity','0');
		$('.spr').css('transform','rotateZ(-10deg)');
		$('.spr2').css('transform','rotateX(-15deg)');
		$('.bkh').css('transform','rotateX(0deg)');
		$('.sq31').css('width','100px').css('height','100px');
		TweenMax.to('.sq1',1,{x:50,y:50});
		TweenMax.to('.sq2',1,{x:50,y:50});
		TweenMax.to('.sq3',1,{x:50,y:50});
		TweenMax.to('.sq4',1,{x:50,y:50});
		TweenMax.to('.sq5',1,{x:50,y:50});
		TweenMax.to('.sq6',1,{x:50,y:50});
		TweenMax.to('.sq7',1,{x:50,y:50});
		TweenMax.to('.sq8',1,{x:50,y:50});
		TweenMax.to('.sq9',1,{x:50,y:50});
		TweenMax.to('.sq10',1,{x:50,y:50});
		TweenMax.to('.sq11',1,{x:50,y:50});
		TweenMax.to('.sq12',1,{x:50,y:50});
		TweenMax.to('.sq13',1,{x:50,y:50});
		TweenMax.to('.sq14',1,{x:50,y:50});
		TweenMax.to('.sq15',1,{x:50,y:50});
		TweenMax.to('.sq16',1,{x:50,y:50});
		TweenMax.to('.sq17',1,{x:50,y:50});
		TweenMax.to('.sq18',1,{x:50,y:50});
		TweenMax.to('.sq19',1,{x:50,y:50});
		TweenMax.to('.sq20',1,{x:50,y:50});
		TweenMax.to('.sq21',1,{x:50,y:50});
		TweenMax.to('.sq22',1,{x:50,y:50});
		TweenMax.to('.sq23',1,{x:50,y:50});
		TweenMax.to('.sq24',1,{x:50,y:50});
		TweenMax.to('.sq25',1,{x:50,y:50});
		TweenMax.to('.sq26',1,{x:50,y:50});
		TweenMax.to('.sq27',1,{x:50,y:50});
		TweenMax.to('.sq28',1,{x:50,y:50});
		TweenMax.to('.sq29',1,{x:50,y:50});
		TweenMax.to('.sq30',1,{x:50,y:50});
		TweenMax.to('.sq31',1,{x:0,y:0});
	}
	
	
	)
$('.bling').hover(
	function(){
		$('.bling').css('transform','rotateZ(888888deg)');
	}
	,function(){
		$('.bling').css('transform','rotateZ(-8000deg)');
	}
)














})