let importantIcon = "fas fa-star";
let notImportantIcon = "far fa-star";
let isImportant = true;
let isPanelVisible = true;

function toggleImportance() {
  console.log("icon clicked!");
  if (isImportant) {
    // switch to none imp
    $("#iImportant").removeClass(importantIcon).addClass(notImportantIcon);
    isImportant = false;
  } else {
    //switch to imp

    $("#iImportant").removeClass(notImportantIcon).addClass(importantIcon);
    isImportant = true;
  }
}
function toggleVisibility() {
  if (isPanelVisible) {
    $("#sect-form").hide();
    isPanelVisible = false;
  } else {
    $("#sect-form").show();
    isPanelVisible = true;
  }
}

function test() {
  $.ajax({
    url: "https://restclass.azurewebsites.net/api/test",
    type: "GET",
    success: function (response) {
      //parameter will receive response of success
      console.log("server says:", response);
    },
    error: function (errorDetails) {
      //parameter will be receiving the error function
      console.log(errorDetails);
    },
  });
}
function saveTask() {
  console.log("Saving task...");
  //get values from the input fields first in the html,create the value, put the values in a variable

  let title = $("#txtTitle").val();
  let desc = $("#txtDesc").val();
  let startDate = $("#txtStartDate").val();
  let dueDate = $("#txtDueDate").val();
  let color = $("#selColor").val();
  let category = $("#txtOption").val();

  if(title.length<5){
    $("#alertError").removeClass("hide");

    setTimeout(function(){
      $("#alertError").addClass("hide");
    } , 3000);
    return;
  }

  

  let task = new Task(title, desc, startDate, dueDate, color, category);
 

  sendTaskToServer(task);

  //display the task
 
}

function clearForm(){
  $("#txtTitle").val("");
  $("#txtDesc").val("");
  $("#txtStartDate").val("");
   $("#txtDueDate").val("");
  $("#selColor").val("#000000");
  $("#txtOption").val("");
}
function sendTaskToServer(task){

  let jsonDATA=JSON.stringify(task);
  

  $.ajax({
    type: "POST",
    url: "https://fsdiapi.azurewebsites.net/api/tasks/",
    data:jsonDATA,
    contentType: "application/json",
    

    success: function(data){
      displayTask(task);

      clearForm();
    },
    error: function (errorDetails){
      console.log(errorDetails);
    },
  });

}
function displayTask(task) {
  let syntax = `
        <div class="task">
            <div class="info"
                <h5>Task Title: ${task.title}</h5>
                <p>Task Description: ${task.desc}</p>
                <p>Category: ${task.category}</p>
            </div>
        <div class="dates">
            <label>Task Start Date:${task.startDate}</label>
            <label>Task Due Date${task.dueDate}<label>
        </div>
        
        </div>`; $("#task-container").append(syntax);
}
function loadTasks(){
  $.ajax({
    type:"GET",
    url:"https://fsdiapi.azurewebsites.net/api/tasks",
    success:function(jsonDATA){
      let data= JSON.parse(jsonDATA); //decode the json from string to onject
      console.log(data);

      //travel the array, get elements, get every task, send the task to be displayed on the screen

      for(let i=0; i<data.length; i++){
        let task =data[i];
        if(task.owner=="Albert"){
          displayTask(task);
        }
       
      }

    },
    error: function(errorDetails) {
      console.error(errorDetails);
    }
  });
}
function init() {
  console.log("Task manager");

  //load data
  loadTasks();

  //hook events
  $("#iImportant").click(toggleImportance);
  $("#btnClear").click(toggleVisibility);
  $("#btnSave").click(saveTask);
}

window.onload = init;
