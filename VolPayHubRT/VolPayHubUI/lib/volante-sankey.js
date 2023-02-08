
function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));    
        } else 
        //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
        if (i == key && obj[i] == val || i == key && val == '') { //
            objects.push(obj);
        } else if (obj[i] == val && key == ''){
            //only add if the object is not already in the array
            if (objects.lastIndexOf(obj) == -1){
                objects.push(obj);
            }
        }
    }
    return objects;
}


//return an array of values that match on a certain key
function getValues(obj, key) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getValues(obj[i], key));
        } else if (i == key) {
            objects.push(obj[i]);
        }
    }
    return objects;
}

//return an array of keys that match on a certain value
function getKeys(obj, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getKeys(obj[i], val));
        } else if (obj[i] == val) {
            objects.push(i);
        }
    }
    return objects;
}


function getTotal(ArrObj,type1){
	var count1=0;
	for(var k=0;k<ArrObj.length;k++){
		count1=count1+ArrObj[k][type1];
	}
	return count1;
}

function jsonToSankeyData(data,key,type1,flag)
{	
var fNode=[];
 for(var i=0;i<data[key].length;i++){
    fNode.push(data[key][i].Currency)
 }

var fNames=[];
 for(var i=0;i<data[key].length;i++){ 	
 	fNames.push(data[key][i].Name)
 }

 function uniques(arr) {
 var a = [];
 for (var i=0, l=arr.length; i<l; i++)
     if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
         a.push(arr[i]);
 return a;

 }
 
UniqNodeArr=uniques(fNode);	
UniqNameArr=uniques(fNames);	
var dataJson={"nodes":[],"links":[]};

for(var j=0;j<UniqNameArr.length;j++){

	dataJson.nodes.push({"node":j,"name":UniqNameArr[j],"type":"Status"})
 }

for(var j=0;j<UniqNodeArr.length;j++){

	dataJson.nodes.push({"node":UniqNameArr.length+j,"name":UniqNodeArr[j],"type":"Currency"})
 }

var js = data[key];

var links=[];
for(var j=0;j<UniqNameArr.length;j++){
	for(var k=0;k<getObjects(js,"Name",UniqNameArr[j]).length;k++){
		//console.log(type1);
		//console.log(getObjects(js,"Name",UniqNameArr[j])[k][type1])
		dataJson.links.push({"source": getObjects(dataJson.nodes,"name",getObjects(js,"Name",UniqNameArr[j])[k].Name)[0].node,"target":getObjects(dataJson.nodes,"name",getObjects(js,"Name",UniqNameArr[j])[k].Currency)[0].node ,"value":getObjects(js,"Name",UniqNameArr[j])[k][type1]})		
	}
 }


if(flag=='totalTrue'){
fTotal=[];

for(var k=0;k<dataJson.links.length;k++){
	fTotal.push(dataJson.links[k].target)
} 


for(var k=0;k<uniques(fTotal).length;k++){
	dataJson.links.push({"source": uniques(fTotal)[k],"target": dataJson.nodes.length,"value": getTotal(getObjects(js,"Currency",getObjects(dataJson.nodes,"node",uniques(fTotal)[k])[0].name),type1)})
}
dataJson.nodes.push({"node":dataJson.nodes.length,"name":"TOTAL","type":"Status"})
}
return dataJson;
}


function CurrencySankey(data,key,type1,flag)
{

 var fNode=[];
 for(var i=0;i<data[key].length;i++){
 	//console.log(data.PaymentStatus[i])
 	fNode.push(data[key][i].Currency)
 }

var fNames=[];
 for(var i=0;i<data[key].length;i++){
 	fNames.push(data[key][i].Name)
 }

 function uniques(arr) {
 var a = [];
 for (var i=0, l=arr.length; i<l; i++)
     if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
         a.push(arr[i]);
 return a;

 }

UniqNodeArr=uniques(fNode);
UniqNameArr=uniques(fNames);
var dataJson={"nodes":[],"links":[]};

for(var j=0;j<UniqNodeArr.length;j++){

	dataJson.nodes.push({"node":j,"name":UniqNodeArr[j],"type":"Currency"})
 }

for(var j=0;j<UniqNameArr.length;j++){

	dataJson.nodes.push({"node":UniqNodeArr.length+j,"name":UniqNameArr[j],"type":"Status"})
 }

var js = data[key];

var links=[];
for(var j=0;j<UniqNameArr.length;j++){
	for(var k=0;k<getObjects(js,"Name",UniqNameArr[j]).length;k++){
		//console.log(type1);
		//console.log(getObjects(js,"Name",UniqNameArr[j])[k][type1])
		dataJson.links.push({"source": getObjects(dataJson.nodes,"name",getObjects(js,"Name",UniqNameArr[j])[k].Currency)[0].node,"target":getObjects(dataJson.nodes,"name",getObjects(js,"Name",UniqNameArr[j])[k].Name)[0].node ,"value":getObjects(js,"Name",UniqNameArr[j])[k][type1]})
	}
 }



if(flag=='totalTrue'){
fTotal=[];

for(var k=0;k<dataJson.links.length;k++){
	fTotal.push(dataJson.links[k].target)
}

for(var k=0;k<uniques(fTotal).length;k++){
	dataJson.links.push({"source": uniques(fTotal)[k],"target": dataJson.nodes.length,"value": getTotal(getObjects(js,"Name",getObjects(dataJson.nodes,"node",uniques(fTotal)[k])[0].name),type1)})
}
dataJson.nodes.push({"node":dataJson.nodes.length,"name":"TOTAL","type":"Status"})
}
return dataJson;
}
