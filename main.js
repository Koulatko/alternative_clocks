const can = document.getElementById('canvas');
const ctx = can.getContext('2d');

function ssX(x,W){
	return W*(x*0.5+0.5);
}
function ssY(y,H){
	return H*(-y*0.5+0.5);
}

function dayOfYear(Y,M,D){
	let d = 0;
	for(let i = 0; i < M-1; i++){
		d += monthLength[i];
	}
	d += D;
	return d;
}

const monthLength = [31,28,31,30,31,30,31,31,30,31,30,31];

function fract(x){
	return x-Math.floor(x);
}

function d(){
	window.requestAnimationFrame(d);

	const W = can.width;
	const H = can.height;

	ctx.fillStyle = 'white';
	ctx.fillRect(0,0,W,H);
	ctx.clearRect(0,0,W,H);
	ctx.font = '30px Arial Bold';

	ctx.fillStyle = 'black';
	ctx.textAlign = 'center';


	const date = new Date();

	//date.setTime(1609452000000 + (date.getTime()-1609452000000)*100000);

	const continuous = false;

	const timezone = document.getElementById('timezone').value;

	let timeOfDay;
	let timeZoneOffset;


	let Y, M, D;
	if(timezone == 'local'){
		Y = date.getFullYear();
		M = date.getMonth()+1;
		D = date.getDate();
		timeZoneOffset = date.getTimezoneOffset()/(-60);
	} else {
		Y = date.getUTCFullYear();
		M = date.getUTCMonth()+1;
		D = date.getUTCDate();

	}

	if(timezone.startsWith('utc')){
		timeZoneOffset = timezone.substring(3);
	}

	if(timezone == 'local'){
		timeOfDay = 3600*date.getHours() + 60*date.getMinutes() + date.getSeconds() + (continuous ? 1.0 : 0.0)*0.001*date.getMilliseconds();
	} else {
		timeOfDay = 3600*date.getUTCHours() + 60*date.getUTCMinutes() + date.getUTCSeconds() + (continuous ? 1.0 : 0.0)*0.001*date.getUTCMilliseconds();


		timeOfDay += timeZoneOffset*3600;

		if(timeOfDay < 0){
			timeOfDay += 86400;
			D--;
		}
		if(timeOfDay > 86400){
			timeOfDay -= 86400;
			D++;
		}
	}

	let timeOfWeek = date.getUTCDay() - 1;

	if(timeOfDay < 3600*timeZoneOffset && timeZoneOffset > 0) timeOfWeek += 1;
	if(timeOfDay < 3600*timeZoneOffset && timeZoneOffset < 0) timeOfWeek -= 1;

	timeOfWeek += timeOfDay/86400;



	console.log(timeOfWeek);
	const clockType = document.getElementById('clocktype').value;


	if(clockType == 'standard'){
		for(let i = 1; i < 13; i++){
			let ang = 2*Math.PI*i/12;
			ctx.fillText(i,ssX(0.8*Math.sin(ang),W),ssY(0.8*Math.cos(ang),H)+8);

			ctx.fillRect(ssX(0.7*Math.sin(ang),W)-2,ssY(0.7*Math.cos(ang),H)-2,4,4);
		}

		for(let i = 0; i < 60; i++){
			let ang = 2*Math.PI*i/60;
			ctx.fillRect(ssX(0.7*Math.sin(ang),W)-1,ssY(0.7*Math.cos(ang),H)-1,2,2);

		}

		let hours_angle = 2.0*Math.PI*(timeOfDay/(12*60*60));
		let minutes_angle = 2.0*Math.PI*(timeOfDay/(60*60));
		let seconds_angle = 2.0*Math.PI*(timeOfDay/(60));

		ctx.strokeStyle = '#000000';
		ctx.strokeWidth = 5;

		ctx.lineWidth = 1;
		ctx.strokeStyle = '#cccccc';

		ctx.beginPath();
		ctx.moveTo(W/2,H/2);
		ctx.lineTo(ssX(0.6*Math.sin(seconds_angle),W),ssY(0.6*Math.cos(seconds_angle),H));
		ctx.stroke();

		ctx.strokeStyle = '#000000';

		ctx.beginPath();
		ctx.moveTo(W/2,H/2);
		ctx.lineTo(ssX(0.5*Math.sin(minutes_angle),W),ssY(0.5*Math.cos(minutes_angle),H));
		ctx.stroke();

		ctx.lineWidth = 2;

		ctx.beginPath();
		ctx.moveTo(W/2,H/2);
		ctx.lineTo(ssX(0.4*Math.sin(hours_angle),W),ssY(0.4*Math.cos(hours_angle),H));
		ctx.stroke();


	}

	if(clockType == '6h'){
		for(let i = 1; i < 7; i++){
			let ang = 2*Math.PI*i/6;
			ctx.fillText(i,ssX(0.8*Math.sin(ang),W),ssY(0.8*Math.cos(ang),H));

			ctx.fillRect(ssX(0.7*Math.sin(ang),W)-2,ssY(0.7*Math.cos(ang),H)-2,4,4);
		}


		let daySegment = 'D';
		if(timeOfDay < 86400*3/4){
			daySegment = 'C';
		}
		if(timeOfDay < 86400*2/4){
			daySegment = 'B';
		}
		if(timeOfDay < 86400*1/4){
			daySegment = 'A';
		}

		ctx.fillText(daySegment,W/2,H/2-0.1*H);

		let hours_angle = 2.0*Math.PI*(timeOfDay/(12*60*60));
		let minutes_angle = 2.0*Math.PI*(timeOfDay/(60*60));
		let seconds_angle = 2.0*Math.PI*(timeOfDay/(60));

		ctx.strokeStyle = '#000000';
		ctx.strokeWidth = 5;

		ctx.lineWidth = 1;
		ctx.strokeStyle = '#cccccc';

		ctx.beginPath();
		ctx.moveTo(W/2,H/2);
		ctx.lineTo(ssX(0.6*Math.sin(seconds_angle),W),ssY(0.6*Math.cos(seconds_angle),H));
		ctx.stroke();

		ctx.strokeStyle = '#000000';

		ctx.beginPath();
		ctx.moveTo(W/2,H/2);
		ctx.lineTo(ssX(0.5*Math.sin(minutes_angle),W),ssY(0.5*Math.cos(minutes_angle),H));
		ctx.stroke();

		ctx.lineWidth = 2;

		ctx.beginPath();
		ctx.moveTo(W/2,H/2);
		ctx.lineTo(ssX(0.4*Math.sin(hours_angle),W),ssY(0.4*Math.cos(hours_angle),H));
		ctx.stroke();


	}




	if(clockType == '24h_t' || clockType == '24h_b'){


		const pi2 = Math.PI*0.5;
		const tau = 2.0*Math.PI;


		const noonUp = clockType == '24h_t';
		var displayBounds = !displayBounds ? false : displayBounds;
		if(displayBounds){
			ctx.fillStyle = '#FFFF88';
			let a1 = 22;
			let a2 = 7;
			let ang1 = -pi2 + (!noonUp ? 2*Math.PI*a1/24 : 2*Math.PI*(a1/24 + 0.5));
			let ang2 = -pi2 + (!noonUp ? 2*Math.PI*a2/24 : 2*Math.PI*(a2/24 + 0.5));

			ctx.beginPath();
			ctx.moveTo(W/2,H/2);
			ctx.arc(W/2,H/2,0.3*W,ang1,ang2);
			ctx.lineTo(W/2,H/2)
			ctx.fill();


			ctx.fillStyle = '#FF8888';
			a1 = 23;
			a2 = 6;
			ang1 = -pi2 + (!noonUp ? 2*Math.PI*a1/24 : 2*Math.PI*(a1/24 + 0.5));
			ang2 = -pi2 + (!noonUp ? 2*Math.PI*a2/24 : 2*Math.PI*(a2/24 + 0.5));

			ctx.beginPath();
			ctx.moveTo(W/2,H/2);
			ctx.arc(W/2,H/2,0.3*W,ang1,ang2);
			ctx.lineTo(W/2,H/2)
			ctx.fill();
		}


		ctx.fillStyle = '#ffffff';

		ctx.font = '20px Arial Bold';
		//let ang = (ang1+ang2)/2-pi2;

		//ctx.fillText("fcking s l e p",ssX(0.3*Math.sin(ang),W)-2,ssY(0.3*Math.cos(ang),H));

		ctx.font = '30px Arial Bold';
		ctx.fillStyle = '#000000';

		for(let i = 0; i < 24; i++){
			let ang = !noonUp ? 2*Math.PI*i/24 : 2*Math.PI*(i/24 + 0.5);

			if(i%1 == 0) {
				ctx.fillText(i,ssX(0.8*Math.sin(ang),W),ssY(0.8*Math.cos(ang),H)+5);
				ctx.fillRect(ssX(0.7*Math.sin(ang),W)-2,ssY(0.7*Math.cos(ang),H)-2,4,4);
			}
		}
		ctx.font = '10px Arial Bold';
		for(let i = 0; i < 12; i++){
			let ang = 2*Math.PI*i/12;
			ctx.fillText(i*5,ssX(0.6*Math.sin(ang),W),ssY(0.6*Math.cos(ang),H)+5);

		}


		for(let i = 0; i < 60; i++){
			let ang = 2*Math.PI*i/60;
			ctx.fillRect(ssX(0.65*Math.sin(ang),W)-1,ssY(0.65*Math.cos(ang),H)-1,2,2);

		}




		let hours_angle = !noonUp ? 2.0*Math.PI*(timeOfDay/(24*60*60)) : 2.0*Math.PI*(timeOfDay/(24*60*60)+0.5);
		let minutes_angle = 2.0*Math.PI*(timeOfDay/(60*60));
		let seconds_angle = 2.0*Math.PI*(timeOfDay/(60));


		let timeOfMonth = D/monthLength[M-1];
		let timeOfYear = dayOfYear(Y,M,D)/365;

		let days_angle = 2.0*Math.PI*timeOfMonth;
		let months_angle = 2.0*Math.PI*timeOfYear;

		ctx.lineWidth = 1;
		ctx.strokeStyle = '#cccccc';

		ctx.beginPath();
		ctx.moveTo(W/2,H/2);
		ctx.lineTo(ssX(0.6*Math.sin(seconds_angle),W),ssY(0.6*Math.cos(seconds_angle),H));
		ctx.stroke();

		ctx.strokeStyle = '#000000';

		ctx.beginPath();
		ctx.moveTo(W/2,H/2);
		ctx.lineTo(ssX(0.5*Math.sin(minutes_angle),W),ssY(0.5*Math.cos(minutes_angle),H));
		ctx.stroke();

		ctx.lineWidth = 2;

		ctx.beginPath();
		ctx.moveTo(W/2,H/2);
		ctx.lineTo(ssX(0.4*Math.sin(hours_angle),W),ssY(0.4*Math.cos(hours_angle),H));
		ctx.stroke();


		/*ctx.lineWidth = 1;

		ctx.beginPath();
		ctx.moveTo(W/2,H/2);
		ctx.lineTo(ssX(0.3*Math.sin(days_angle),W),ssY(0.3*Math.cos(days_angle),H));
		ctx.stroke();

		ctx.lineWidth = 3;

		ctx.beginPath();
		ctx.moveTo(W/2,H/2);
		ctx.lineTo(ssX(0.2*Math.sin(months_angle),W),ssY(0.2*Math.cos(months_angle),H));
		ctx.stroke();*/

	}

	if(clockType == 'week'){
		for(let i = 0; i < 7; i++){
			let ang1 = 2*Math.PI*(i+0.0)/7;
			let ang2 = 2*Math.PI*(i+0.5)/7;
			const dayNames = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
			ctx.font = '15px Arial';
			ctx.fillText(dayNames[i],ssX(0.6*Math.sin(ang2),W),ssY(0.6*Math.cos(ang2),H));
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(ssX(0.7*Math.sin(ang1),W),ssY(0.7*Math.cos(ang1),H));
			ctx.lineTo(ssX(0.8*Math.sin(ang1),W),ssY(0.8*Math.cos(ang1),H));
			ctx.stroke();

			ctx.beginPath();
			ctx.moveTo(ssX(0.78*Math.sin(ang2),W),ssY(0.78*Math.cos(ang2),H));
			ctx.lineTo(ssX(0.8*Math.sin(ang2),W),ssY(0.8*Math.cos(ang2),H));
			ctx.stroke();
		}




		let days_angle = 2*Math.PI*timeOfWeek/7;

		ctx.strokeStyle = '#000000';

		ctx.lineWidth = 2;


		ctx.beginPath();
		ctx.moveTo(W/2,H/2);
		ctx.lineTo(ssX(0.6*Math.sin(days_angle),W),ssY(0.6*Math.cos(days_angle),H));
		ctx.stroke();




	}


	if(clockType == 'year'){
		const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
		let ang1 = 0;
		let ang2 = 0.2;
		let leap = Y%4 == 0 && (Y%100 != 0 || Y%400 == 0);
		let year_length = 365;
		if(leap) year_length++;
		for(let i = 0; i < 12; i++){




			ctx.font = '15px Arial';
			ctx.fillText(monthNames[i],ssX(0.6*Math.sin(ang2),W),ssY(0.6*Math.cos(ang2),H));
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(ssX(0.7*Math.sin(ang1),W),ssY(0.7*Math.cos(ang1),H));
			ctx.lineTo(ssX(0.8*Math.sin(ang1),W),ssY(0.8*Math.cos(ang1),H));
			ctx.stroke();

			ang1 += 2*Math.PI*monthLength[i]/year_length;
			ang2 += 2*Math.PI*monthLength[i]/year_length;
		}

		let year_angle = 2*Math.PI*dayOfYear(Y,M,D)/year_length;
		ctx.strokeStyle = '#000000';

		ctx.lineWidth = 2;


		ctx.beginPath();
		ctx.moveTo(W/2,H/2);
		ctx.lineTo(ssX(0.6*Math.sin(year_angle),W),ssY(0.6*Math.cos(year_angle),H));
		ctx.stroke();

	}

	ctx.font = '15px Arial Bold';

	ctx.fillText(Y+"-"+M+"-"+D,W-0.1*W,H - 0.05*H);


}

d();
