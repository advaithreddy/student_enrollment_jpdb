// Can Be Updated var
var jpdbBaseUrl = "http://api.login2explore.com:5577";
var jpdbIrl = "/api/irl";
var jpdbIml = "/api/iml";
var sclDBName = "SCHOOL-DB";
var School_relation = "Stu-Sclrel";
var connectionToken = "90931315|-31949328527542427|90950447";

//  We can even use auto focus but jquery seems good to me 🤖
$("#rollNo").focus();


function saveRecNoToLocalStorage(jsonObj) {
  var lvData = JSON.parse(jsonObj.data);
  localStorage.setItem("recno", lvData.rec_no);
}

function getRollNoAsJsonObj(){
  var rollno = $("#rollNo").val();
  var jsonStr = {
    id: rollno
  };
  return JSON.stringify(jsonStr);
}

function fillData(jsonObj){
  saveRecNoToLocalStorage(jsonObj);
  var record = JSON.parse(jsonObj.data).record;
  $("#fullName").val(record.name);
  $("#class").val(record.stclass);
  $("#birthDate").val(record.birthDate);
  $("#address").val(record.address);
  $("#enrollmentDate").val(record.enrollmentdate);
}

function resetForm() {
  $("#rollNo, #fullName, #class, #birthDate, #address, #enrollmentDate").val("");
  $("#rollNo").prop("disabled", false);
  $("#save").prop("disabled", true);
  $("#change").prop("disabled", true);
  $("#reset").prop("disabled", true);
  $("#rollNo").focus();
}


function validateData(){
  var rollno, name, stclass, birthDate, address, enrollmentdate;
  rollno = $("#rollNo").val();
  name = $("#fullName").val();
  stclass = $("#class").val();
  birthDate = $("#birthDate").val();
  address = $("#address").val();
  enrollmentdate = $("#enrollmentDate").val();

  if(rollno === ""){
    alert("Please Enter Roll No");
    $("#rollNo").focus();
    return "";
  }

  if(name === ""){
    alert("Please Enter Full name");
    $("#fullName").focus();
    return "";
  }

  if(stclass === ""){
    alert("Please Enter Class");
    $("#class").focus();
    return "";
  }

  if(birthDate === ""){
    alert("Please Birth Date");
    $("#birthDate").focus();
    return "";
  }

  if(address === ""){
    alert("Please Enter Address");
    $("#address").focus();
    return "";
  }

  if(enrollmentdate === ""){
    alert("Please Enter Enrollment Date");
    $("#enrollmentDate").focus();
    return "";
  }

  // Forming Json String Obj
  var jsonStrObj = {
    rollno : rollno,
    name : name,
    stclass : stclass,
    birthDate: birthDate,
    address: address,
    enrollmentdate: enrollmentdate
  };

  return JSON.stringify(jsonStrObj);
}

function getRoll(){
  var rollNoJsonObj = getRollNoAsJsonObj();
  var getRequest = createGET_BY_KEYRequest(connectionToken, sclDBName,School_relation,rollNoJsonObj);
  jQuery.ajaxSetup({async:false});
  var resJsonObj = excuteCommandAtGivenBaseUrl(getRequest, jpdbBaseUrl, jpdbIml);
  jQuery.ajaxSetup({async:true});
  if(resJsonObj.status === 400){
    $("#save").prop("disabled",false);
    $("#reset").prop("disabled",false);
    $("#rollNo").focus();
  }else if(resJsonObj.status === 200){
    $("#rollNo").prop("disabled",true);
    fillData(resJsonObj);

    $("#change").prop("disabled",false);
    $("#reset").prop("disabled",false);
    $("#fullName").focus();
  }
}

function saveData() {
  var jsonStrObj = validateData();
  if (!jsonStrObj) {
    return;
  }
  var putReq = createPUTRequest(connectionToken, jsonStrObj, sclDBName, School_relation);
  jQuery.ajaxSetup({async:false});
  var resJsonObj = excuteCommandAtGivenBaseUrl(putReq, jpdbBaseUrl, jpdbIml);
  jQuery.ajaxSetup({async:true});
  resetForm();
}

function changeData(){
  $('#change').prop("disabled", true);
  var jsonChg = validateData();
  var updateRequest = createUPDATERecordRequest(connectionToken, jsonChg, sclDBName, School_relation, localStorage.getItem("recno"));
  jQuery.ajaxSetup({async:false});
  var resJsonObj = excuteCommandAtGivenBaseUrl(updateRequest, jpdbBaseUrl, jpdbIml);
  jQuery.ajaxSetup({async:true});
  resetForm();
}
