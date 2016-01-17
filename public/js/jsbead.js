function $ (id) {
	return document.getElementById(id);
}

function init (){
	$('sett').addEventListener('click',display,false);
	settings=$('settings');
	$('start').addEventListener('click',gameStart,false);
	document.addEventListener('keydown', game, false);
	document.addEventListener('keydown', gameStartSpace, false);
}

window.addEventListener('load', init, false);
//DISPLAY
function display(){
	if(settings.style.display == 'none'){
		settings.style.display = 'block';
	}
	else{
		settings.style.display = 'none';
	}
}
function addTpHibaClass(){
	$('tpHiba').className ='tpHibaClass';
}
function takeTpHibaDisplay(){
	$('tpHiba').className = $('tpHiba').className - 'tpHibaClass';
}
function tpHibaClassDisplay(){
	if($('tpHiba').style.display == 'none'){
		$('tpHiba').style.display = 'block';
	}
	else{
		$('tpHiba').style.display = 'none';
	}
}

//GAME

	// GAME - START
function gameStartSpace(e){
	if(e.keyCode == 13 || e.keyCode ==32) gameStart();
}
function gameStart(){
	vege=false;
	n=parseInt($('n').value);
	m=parseInt($('m').value);
	k=10;
	level=1;
	stepCount = 0;
	$('tpHiba').innerHTML =""
	$('gameResult').innerHTML = level +". Szint";
	$('hibaMSG').innerHTML =""	
	$('start').innerHTML = "<i class='fa fa-refresh'> Restart</i>";
	takeTpHibaDisplay();
	gameInit();
}

	// GAME- THE GAME
function gameInit(e){
	takeTpHibaDisplay();
	szuperSz=parseInt($('superSz').value);
	superCount=szuperSz;
	$('steps').innerHTML = '<span class="stepClass">Pontjaid:</span>' + stepCount+'<span class="superClass">Biztonságos teleportálások száma:</span>'+superCount;
	if(n<=0 || m <=0 || k<=0){
		$('hibaMSG').innerHTML = "<li>Ellenőrizze, hogy minden hova 0nál nagyobb számot írt be.</li>"
		return;
	}
	randomNumbers=[];
	while(randomNumbers.length<k+1)
	{
		var randomnumber=veletlen(n);
		var randomnumberr=veletlen(m);
		var found=false;
		for(var i=0;i<randomNumbers.length;i++){
			if( randomNumbers[i].x==randomnumber && randomNumbers[i].y==randomnumberr ){found=true;break}
		}
		  if(!found){
		  	randomNumbers.push({x: randomnumber, y:randomnumberr})
		  };
	}

	jonas = {
		x: randomNumbers[0].x,
		y: randomNumbers[0].y
	};
	robot=[];
	roncs=[];
	for(var i=1;i<=k;i++){
		robot.push(randomNumbers[i]);
	}

	$('game').innerHTML = genTable(n,m);
}	
function genTable(n,m){
	var s='';
	for(var i=0;i<n;i++){	
		s +='<tr>';
		for(var j=0;j<m;j++){
			wcase=0;
			vanjonas = i==jonas.x && j==jonas.y ;
			if(vanjonas){
				wcase=1;
			}
			for(var t=0;t<robot.length;t++)
			{
				vanrobot = i==robot[t].x && j==robot[t].y;
				if( vanrobot && !vanjonas){
					wcase=2;
				}else if(vanjonas && vanrobot){
					wcase=3;
					break;
				}
			}
			for(var t=0;t<roncs.length;t++){
				vanroncs = i==roncs[t].x && j==roncs[t].y;
				if(vanroncs && !vanjonas){
					wcase=4;
				}else if(vanroncs && vanjonas){
					wcase=5;
					break;
				}
			}
			if(wcase==1){s+='<td class="j"><div ></div></td>';}
			else if(wcase==2){s+='<td class="robot" ><div ></div></td>';}
			else if(wcase==3){s+='<td class="bumm"> <div></div></td>';}
			else if(wcase==4){s+='<td class="bumm"> <div ></div></td>';}
			else if(wcase==5){s+='<td class="bumm"> <div ></div></td>';}
			else{s+='<td></td>';};
		}
		s+='</tr>';
	}
	return s;
}
function game (e){
    if(vege){
    	return;	
    } 
    if ((e.keyCode == 37 || e.keyCode == 65)) {
		 // left arrow | a
		 if(jonas.y == 0 ){
		 	return;
		 }else{
		 	 jonas.y = jonas.y-1;
		 	 robotLep();
		 	 stepCount--;
			 e.preventDefault();
		}
    } else if ((e.keyCode == 38 || e.keyCode == 87)) {
         // up arrow | w
		 if(jonas.x == 0 ){
		 	return;
		 }else{
		 	 jonas.x = jonas.x-1;
		 	 robotLep();
			 stepCount--;
			 e.preventDefault();
		}
    } else if ((e.keyCode == 39 || e.keyCode == 68)) {
         //right arrow | d
		 if(jonas.y == m-1 ){
		 	return;
		 }else{
		 	 jonas.y = jonas.y+1;
		 	 robotLep();
		 	 stepCount--;
			 e.preventDefault();
		}
    } else if ((e.keyCode == 81)) {
         // q
		 if(jonas.x == 0 || jonas.y==0 ){
		 	return;
		 }else{
		 	 jonas.x = jonas.x-1;
		 	 jonas.y = jonas.y-1;
		 	 robotLep();
		 	 stepCount--;
			 e.preventDefault();
		}
    } else if ((e.keyCode == 69)) {
         // e
		 if(jonas.x == 0 || jonas.y==m-1 ){
		 	return;
		 }else{
		 	 jonas.x = jonas.x-1;
		 	 jonas.y = jonas.y+1;
		 	 	robotLep();
		 	 stepCount--;
			 e.preventDefault();
		}
    }else if ((e.keyCode == 89)) {
         // y
		 if(jonas.x == n-1 || jonas.y==0 ){
		 	return;
		 }else{
		 	 jonas.x = jonas.x+1;
		 	 jonas.y = jonas.y-1;
		 	 	robotLep();
		 	 stepCount--;
			 e.preventDefault();
		}
    }else if ((e.keyCode == 88)) {
         // x
		 if(jonas.x == n-1 || jonas.y==m-1 ){
		 	return;
		 }else{
		 	 jonas.x = jonas.x+1;
		 	 jonas.y = jonas.y+1;
		 	 	robotLep();
		 	 stepCount--;
			 e.preventDefault();
		}
    }else if ((e.keyCode == 40 || e.keyCode == 83)) {
         //down arrow | s
		 if(jonas.x == n-1 ){
		 	return;
		 }else{
		 	 jonas.x = jonas.x+1;
		 	 robotLep();
		 	 stepCount--;
			 e.preventDefault();
		}
	}else if(e.keyCode == 84){
    	
    	if(superCount>0){
    		teleport=[];
    		var noPlace=0;
    		for(var i=0;i<n;i++){
    			for(var j=0;j<m;j++){
    			  for(var zs in robot){
    			  		var found=false;
	    				if(robot[zs].x == i && robot[zs].y==j ){found=true;break;}else
	    				if(robot[zs].x+1 == i && robot[zs].y==j){found=true;break;}else
	    				if(robot[zs].x == i && robot[zs].y+1==j){found=true;break;}else
	    				if(robot[zs].x+1 == i && robot[zs].y+1==j){found=true;break;}else
	    				if(robot[zs].x-1 == i && robot[zs].y==j){found=true;break;}else
	    				if(robot[zs].x == i && robot[zs].y-1==j){found=true;break;}else
	    				if(robot[zs].x-1 == i && robot[zs].y-1==j){found=true;break;}else
	    				if(robot[zs].x+1 == i && robot[zs].y-1==j){found=true;break;}else
	    				if(robot[zs].x-1 == i && robot[zs].y+1==j){found=true;break;}
	    			}
	    			for(var zs in roncs){
	    				if(roncs[zs].x == i && roncs[zs].y==j){found=true;break}
	    			}
	    			if(!found){
	    			teleport.push({x: i,y:j});
	    			}
    			}
    		}
    		if(teleport.length>0){
	    		var koords = veletlen(teleport.length);
	    		jonas.x=teleport[koords].x;
	    		jonas.y=teleport[koords].y;
	    		superCount--;
	    		stepCount-=100;
	    		robotLep();
	    	}else{
	    			addTpHibaClass()
	    			$('tpHiba').innerHTML = "Nem tudok biztonsásgos mezőre teleportálni";
	    	}
    	}else{
    			tElsoKoord = veletlen(n);
    			tMasodikKoord= veletlen(m);
    			jonas.x=tElsoKoord;
    			jonas.y=tMasodikKoord;
    			stepCount-=100;
    			robotLep();
    	}
    }
    objCollapse();

	$('game').innerHTML = genTable(n,m);
	$('steps').innerHTML = '<span class="stepClass">Pontjaid:</span>' + stepCount+'<span class="superClass">Biztonságos teleportálások száma:</span>'+superCount;
	if(robot.length==0 && !vege){
    	level++;
    	k+=10;
    	$('gameResult').innerHTML = level +". Szint";
    	gameInit();
    }
	jatekVege();
}	
function robotLep(){
	for(var i in robot){
		if(robot[i].x < jonas.x){
			robot[i].x+=1;
		}else if(robot[i].x>jonas.x){
			robot[i].x-=1;
		}else{
			robot[i].x=robot[i].x;
		}
		if(robot[i].y < jonas.y){
			robot[i].y+=1;
		}else if(robot[i].y>jonas.y){
			robot[i].y-=1;
		}else{
			robot[i].y=robot[i].y;
		}
	}
}
function objCollapse(){

	for(var i=0;i<robot.length-1;i++){

		for(var j=i+1;j<robot.length;j++){
			if( (robot[j].x == robot[i].x) && (robot[j].y == robot[i].y) ) {
				roncs.push(new RoncsGen(robot[j].x,robot[j].y));
				robot.splice(i,1);
				robot.splice(j-1,1);
				stepCount+=40;
				break;
			}
		}
	}
	
	for(var i=0;i<roncs.length;i++){
		for(var j=0;j<robot.length;j++){
			if( (robot[j].x == roncs[i].x) && (robot[j].y == roncs[i].y) ) {
				roncs.push(new RoncsGen(robot[j].x,robot[j].y));
				robot.splice(j,1);
				stepCount+=20;
				break;	
			}
		}
	}
}
function jatekVege(){
	for(var i=0;i<robot.length;i++){
		if(robot[i].x == jonas.x && robot[i].y == jonas.y){
			$('gameResult').innerHTML = "Vége - Vesztettél a(z) " + level + ". szinten. ";
			vege= true;
		}
	}
	for(var i=0;i<roncs.length;i++){
		if(roncs[i].x == jonas.x && roncs[i].y == jonas.y){
			$('gameResult').innerHTML = "Vége - Vesztettél a(z) " + level + ". szinten. ";
			vege= true;
		}
	}
	if(vege){
		rekordment(stepCount);
	}
}

//HELP FUNCTIONS 
function xyKoord(td) {
 var x = td.cellIndex;
 var tr = td.parentNode;
 var y = tr.sectionRowIndex;
 return {
 x: x,
 y: y
 };
}
function RobotGen(x,y){
		this.x = x;
		this.y = y;
}
function RoncsGen(x,y){
		this.x = x;
		this.y = y;
}
function veletlen(n){
	return Math.floor(Math.random()*n);
}

function rekordment(pont){
	var pontok = pont;
	ajax({
		url: 'rekordment',
		getadat: pontok,
		siker: function (xhr, data){
					var json = JSON.parse(data);
					var str = "" ;
					console.log(json);
					for (var i=0;i<json.records.length;i++) {
					  str += json.records[i].date + " Pont: " + json.records[i].pont + "<br>";
					}
					$('rekordok').innerHTML = str; 
				}
	});
	
}