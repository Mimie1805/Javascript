	var canvas = document.getElementById("myC"),
	context = canvas.getContext("2d"),
	gravity = 0.2,
	bounceBall = 0.998,
	colors = ["black","red","blue","green","cyan", "gray", "indigo", "navy", "purple", "yellow"]; //colour choices
	
	
	function Circle(x,y){ //Circle constructor
		this.speed = Math.floor((Math.random() * 10) + 1); //speed between 1 and 10
		this.angle = Math.floor((Math.random() * (360-270+1)) + 270); //random angle, but always going on the right direction on click
		this.radian = this.angle * Math.PI / 180;
		this.x = x;
		this.y = y;
		this.vx = 2*Math.cos(this.radian) * this.speed; 
		this.vy = 2*Math.sin(this.radian) * this.speed; 
		this.radius = 20;
		this.color = colors[Math.floor((Math.random() * colors.length))]; //random colour for the circle
	}
	
	Circle.prototype = {
		//Circle object methods
		draw: function(){
			context.beginPath();
			context.arc(this.x, this.y, this.radius, 0, Math.PI*2); //draw the circle
			context.fillStyle = this.color;
			context.fill(); //fill the circle with colour
			context.closePath();
		},
		
		fall: function(){
			this.x += this.vx;
			this.y += this.vy;
			
			this.vy += gravity;
			
			this.vx *= bounceBall;
			this.vy *= bounceBall;
			
			//collision with the "window wall"
			if((this.y + this.radius) > canvas.height || this.y - this.radius < 0){
				if(this.y - this.radius < 0){ //bottom
					this.y = this.radius;
				}else{//top
					this.y = canvas.height - this.radius;
				}
				this.vy *= -bounceBall/2; //divide with 2 to "stop" the bounce
			}
			
			if((this.x + this.radius) > canvas.width || this.x - this.radius < 0){
				if(this.x - this.radius < 0){
					this.x = this.radius;
				}else{
					this.x = canvas.width - this.radius;
				}
				this.vx *= -bounceBall/2;
			}
		}
	
	};
	
	function collision(circle1, circle2){ //handle collision between two circles
		var dx = circle2.x - circle1.x,
		dy = circle2.y - circle1.y,
		d = Math.sqrt(dx*dx + dy*dy), //distance from circle1 to circle2
		ux = dx / d,
		uy = dy / d;

		if(d < circle1.radius + circle2.radius){ //the two circles touch each other, it reverses direction
			circle1.vx -= ux * bounceBall;
			circle1.vy -= uy * bounceBall;
			circle2.vx += ux * bounceBall;
			circle2.vy += uy * bounceBall;
		}
	}
	var circles = []; //hold circles
	
	canvas.addEventListener("click", function(e){
		//x & y are the coordinate of the click
		var x = e.pageX,
		y = e.pageY;
		circles.push(new Circle(x, y)); //create new circle and put it in the array
	});
	
	(function update() {
		//get the size of the window, and not default size of canvas and update the window size
		canvas.width = window.innerWidth;
		canvas.height  = window.innerHeight ;
		context.clearRect(0, 0, canvas.width, canvas.height);
		for (var i = 0; i < circles.length; i++) {
			var circle = circles[i];
			circle.draw(); // this will draw current ball
			circle.fall(); // this will update its position
			for(var j = i+1; j < circles.length; j++){ //handle collision
				collision(circle,circles[j]);
			}
		}

		requestAnimationFrame(update);
	})();