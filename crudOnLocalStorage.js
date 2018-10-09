//Localdata

function checkLocalData(){
	localData=JSON.parse(localData);
	localData.appTitle=localData.appTitle||'C.R.U.D. OPERATION ON LOCAL STORAGE TABLE';
	document.title=localData.appTitle;
	localData.database=localData.database||"Test Database";
	localData.table=localData.table||[{name:"table 1",data:[["ID","NAME"]]},{name:"table 2",data:[["ID","NAME2"]]}];
	console.log("localData: "+JSON.stringify(localData));
}

//CRUD Functions

function getFormParams(){
	var param=[];
	for(var i=0; i<localData.table[tablePointer].data[0].length; i++) {
		param.push($("#input"+i).val());
	}
	if(param[0]=="") param[0]=maxId();
	return param
}

function maxId(){
	var maxId=0;
	for(var i=0; i<localData.table[tablePointer].data.length; i++) {
		if(localData.table[tablePointer].data[i][0]*1>maxId) maxId=localData.table[tablePointer].data[i][0]*1;
	}
	maxId+=1;
	return maxId	
}

function update_value(){
	bootbox.confirm({
		size:'small',
		message:"Are you sure?",
		callback: function(result){ 
			if(result==true){
				var insertData=getFormParams();
				var tempData=[];
				var flag=false;
				for(var i=0;i<localData.table[tablePointer].data.length;i++){
					if(localData.table[tablePointer].data[i][0]==insertData[0]){
						tempData.push(insertData);
						flag=true;
						console.log('cambio realizado');
					}else{
						tempData.push(localData.table[tablePointer].data[i]);
					}
				}
				if(!flag){
					tempData.push(insertData);
					console.log('nuevo registro incorporado');
				} 
				localData.table[tablePointer].data=tempData;
				refresh();
			}
		}
	});
}

function refresh(){
	$("#form").hide();
	$("#loader").show();
	setTimeout('$("#loader").hide();',1000);
	$('#formTitle').html('<span class="glyphicon glyphicon-cog" onclick="jsonDataToggle();"></span>  '+localData.database+" : "+localData.table[tablePointer].name);
	$("#table").html(createTable(localData.table[tablePointer]));
	$("#form").html(createForm(localData.table[tablePointer]));
	$('#jsonData').html(createJsonDisplay);
	$('#tableSelector').html(createTableSelector());
	localStorage.setItem(localStorageName,JSON.stringify(localData));
	$("#jsonData_in").val(JSON.stringify(localData,null,'\t'));
	$("#table").show();
}

function delete_value(){
	bootbox.confirm({
		size:'small',
		message:"Are you sure to delete record?",
		callback: function(result){ /* your callback code */ 
			if(result==true){
				var deleteData=getFormParams();
				console.log('data a borrar: '+JSON.stringify(deleteData));
				var tempData=[];
				var flag=false;
				for(var i=0;i<localData.table[tablePointer].data.length;i++){
					if(localData.table[tablePointer].data[i][0]==deleteData[0]){
						flag=true;
						console.log('registro borrado');
					}else{
						tempData.push(localData.table[tablePointer].data[i]);
					}
				}
				localData.table[tablePointer].data=tempData;
				refresh(); 
			}
		}
	});
}

//JSON LocalStorage functions

function jsonSave(){
	bootbox.confirm({
		size:'small',
		message:"Are you sure to SAVE changes on the DATABASE?",
		callback: function(result){ /* your callback code */ 
			if(result==true){
				localStorage.setItem(localStorageName,$("#jsonData_in").val());
				localData=localStorage.getItem(localStorageName)||JSON.stringify({});
				checkLocalData();
<<<<<<< HEAD
				refresh();	
=======
				read_value();	
>>>>>>> ba443fd7b6175eb8583f0cb7a5bee7bef0a56dbf
			}
		}
	});
}

function jsonResetValues(){
	bootbox.confirm({
		size:'small',
		message:"Are you sure to RESET the ENTIRE DATABASE?",
		callback: function(result){ /* your callback code */ 
			if(result==true){
				localStorage.setItem(localStorageName,JSON.stringify({}));
				localData=localStorage.getItem(localStorageName);
				checkLocalData();
<<<<<<< HEAD
				refresh();	
=======
				read_value();	
>>>>>>> ba443fd7b6175eb8583f0cb7a5bee7bef0a56dbf
			}
		}
	});
}

function jsonRefresh(){
	bootbox.confirm({
		size:'small',
		message:"Are you sure to REFRESH the ENTIRE DATABASE? (CHANGES WILL BE LOST)",
		callback: function(result){ /* your callback code */ 
			if(result==true){
				$("#jsonData_in").val(JSON.stringify(localData));	
			}
		}
	});	
}

function jsonCopy(){
	bootbox.alert('Database copied in the clipboard! (JSON text format)');	
	$('#jsonData_in').focus();
	$('#jsonData_in').select();
	document.execCommand('copy');
}

//Display functions

function setForEdit(row){
	for(i=0; i<localData.table[tablePointer].data[0].length; i++) {
		$("#input"+i).val(localData.table[tablePointer].data[row][i]);
	}
	$("#form").show();
	$("#table").hide();
}

function createTable(table){
	table.caption	=	table.caption	||	"esta es una prueba";
	table.column	=	table.column	||	[];

	var tb = '<div class="col-sm-12"><div class="table-responsive"><table class="table table-hover table-condensed table-bordered" id="myTable"><caption><h3>'+table.caption+'</h3></caption><thead><tr>';
	for(i=0; i<table.data[0].length; i++){
		table.column[i]				=	table.column[i]				||{};
		table.column[i].visible		=	table.column[i].visible		||"true";
		table.column[i].align 		=	table.column[i].align 		||"left";
		table.column[i].caption		=	table.column[i].caption		||table.data[0][i];
		table.column[i].placeholder	=	table.column[i].placeholder	||table.data[0][i];
		table.column[i].readonly	=	table.column[i].readonly	||"false";
		
		if(table.column[i].visible=="true") tb += '<th>'+table.column[i].caption+'</th>';
	}
		tb+='<tr></thead>';
	for (i = 1; i < table.data.length; i++) {
		tb += '<tr row="'+i+'" onClick="setForEdit('+i+')">';
		for(j=0;j<table.data[0].length;j++){
			if(table.column[j].visible=="true"){ 
				tb+='<td align="'+table.column[j].align+'">'+table.data[i][j]+'</td>';
			}
		}
		tb+='</tr>';
	}
	tb += '</table></div>';
	tb += '<div align="right"><button type="button" class="btn btn-default btn-sm" onClick="$(\'input\').val(\'\');$(\'#form\').show();$(\'#table\').hide();"><span class="glyphicon glyphicon-plus-sign"></span> New Record</button></div><br></div>';
	return tb;
}

function formButtonResetValues(){
	$("input").val("");
}
function formButtonList(){
	$("#form").hide();
	$("#table").show();
}
function formButtonSave(){
	update_value();
}
function formButtonDelete(){
	delete_value();
}

function createForm(table){
	var fm 	=	`
	<div class="col-sm-12" style="text-align: left;" id="formData" >
		<div class="well well-sm">
			<div class="btn-group">
				<button type="button" id="buttonResetValues" class="btn btn-default btn-sm" onclick="formButtonResetValues();">
					<span class="glyphicon glyphicon-erase"></span> Reset
				</button>
				<button type="button" id="buttonList" class="btn btn-default btn-sm" onClick="formButtonList();">
					<span class="glyphicon glyphicon-list"></span> List
				</button>
				<button type="button" id="buttonSave" class="btn btn-default btn-sm" onclick="formButtonSave();">
					<span class="glyphicon glyphicon-save"></span> Save
				</button>          
				<button type="button" id="buttonDelete" class="btn btn-default btn-sm" onclick="formButtonDelete();">
					<span class="glyphicon glyphicon-remove"></span> Delete
				</button>
			</div>
		</div>
		<div id="form_fields">
	`;

	fm 	+=	'<form class="form-horizontal" action="/action_page.php">';
	for(i=0; i<table.data[0].length; i++) {
		fm 	+=	'<div class="form-group"><label class="control-label col-sm-4" for="'+table.data[0][i]+'">'+table.column[i].caption+'</label><div class="col-sm-8"><input type="text" class="form-control input-sm" maxlength="80" size="80" id="input'+i+'" placeholder="'+table.column[i].placeholder+'"';
		if(table.column[i].readonly=="true") fm+=' readonly';
		fm 	+=	'></div></div>';
	}
	fm+='</form>';

	fm 	+=	`</div>
	</div>
	`;
	return fm;
}

function tableSelectorChange(){
	tablePointer=$('#tableSelector option:selected').attr('id');
	refresh(); //read_value();
}

function createTableSelector(){
	var res='<label for="sel1">Select TABLE:</label><select class="form-control" id="tableSelector" onchange="tableSelectorChange();">;'
    for(var i=0;i<localData.table.length;i++) {
    	if(i==tablePointer){
    		res+='<option id="'+i+'" selected="true">'+localData.table[i].name+'</option>';
    	}else{
    		res+='<option id="'+i+'">'+localData.table[i].name+'</option>';
    	}
    }
  	res+='</select>';
 	return res;
}

function jsonDataToggle(){
	if($("#jsonData").css("display")=="none"){
		bootbox.prompt({
			title: "Ingrese la clave de operaciones especiales",
	        inputType: 'password',
	        callback: function (result) {
	            if(result=="1111")	$('#jsonData').toggle();
	            $('#jsonData_in').focus();
	        }
	    });
	}
}
<<<<<<< HEAD

function createJsonDisplay(){
	var html=`
		<div class="col-sm-12">
		<div class="form-group">
			<h3>Database Raw Data (JSON format)     <span class="glyphicon glyphicon-eye-close" onclick='$("#jsonData").toggle();'></span></h3>
			<div class="btn-group">
				<button type="button" id="jsonResetValues" class="btn btn-default btn-sm" onclick="jsonResetValues();">
					<span class="glyphicon glyphicon-erase"></span> Reset
				</button>
				<button type="button" id="jsonSave" class="btn btn-default btn-sm" onclick="jsonSave();">
					<span class="glyphicon glyphicon-save"></span> Save
				</button>
				<button type="button" class="btn btn-default btn-sm">
					<span class="glyphicon glyphicon-export"></span> Backup
				</button>
				<button type="button" class="btn btn-default btn-sm">
					<span class="glyphicon glyphicon-import"></span> Restore
				</button>					
				<button type="button" class="btn btn-default btn-sm" onclick="jsonCopy();">
					<span class="glyphicon glyphicon-copy"></span> Copy
				</button>
            	<button type="button" class="btn btn-default btn-sm" onclick='jsonRefresh();'>
     	 			<span class="glyphicon glyphicon-refresh"></span> Refresh
    			</button>          
			</div>
			<textarea class="form-control" rows="10" id="jsonData_in"></textarea>
		</div> 
		</div>
	`;
	return html;
}
=======
>>>>>>> ba443fd7b6175eb8583f0cb7a5bee7bef0a56dbf
