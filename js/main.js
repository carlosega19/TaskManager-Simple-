class Task{
     constructor(title , duration){
          this.title = title;
          this.duration = duration;
     }
}
const tasks = localStorage.getItem('tasks') ? JSON.parse(localStorage.getItem('tasks')) : [];

//HTMLSELECTOR
const tasksForm = document.querySelector('.tasks_form'),
     addTaskBtn = document.querySelector('.add_task'),
     taskTitle = document.querySelector('.task_title'),
     taskDuration = document.querySelector('.task_time'),
     tasksContainer = document.querySelector('.tasks'),
     totalH = document.querySelector('.totalH')
;
let taskChecks = document.querySelectorAll('.removeTask');
updateView();

function createCard(task){
     const { title , duration } = task;
     let html = `   <div class="task">
                         <h2>${title}</h2>
                         <hr>
                         <p><span>${duration} h</span></p>
                         <input class="removeTask fa-regular fa-circle-check" type="checkbox">
                    </div>`;
     return html;
}

function total(){
     return tasks.reduce((acc, curr) => acc + parseFloat(curr.duration),0);
}
function updateView(){
     tasksContainer.innerHTML = '';
     taskTitle.value = '';
     for (const task of tasks) {
          let card = createCard(task);
          tasksContainer.innerHTML += card;
     }
     let totalHours = total();
     totalH.innerHTML =` ${totalHours} h`; 
     taskChecks = document.querySelectorAll('.removeTask');
     applyEvents(taskChecks);
}

function addTask(){
     const title = taskTitle.value; 
     const time = taskDuration.value;
     if (title === '' || time == '') { 
          Toastify({
               text: "Empty field !",
               className: "info",
               position: "center",
               style: {
                    background: "linear-gradient(to right, #368f8b, #246a73)",
                    color: "#fff",
               }
          }).showToast(); 
          return;
     }
     
     
     const newTask = new Task(title,time);
     tasks.push(newTask);
     localStorage.setItem('tasks',JSON.stringify(tasks));
     updateView();
}

function applyEvents(checks){
     checks.forEach(el => {
          el.addEventListener('change' , ()=>{
               setTimeout(()=>{
                    const jsConfetti = new  JSConfetti();
                    jsConfetti.addConfetti({
                         confettiRadius: 3,
                         confettiNumber: 200,
                    });
                    removeTask(el);
               } , 1000)
               
          });
     });
}

//Remove specific task from array and view
function removeTask(element){
     let index =  Array.from(taskChecks).indexOf(element);
     tasks.splice(index,1);
     localStorage.setItem('tasks',JSON.stringify(tasks));
     element.parentElement.remove();
     updateView();
}

//Events
tasksForm.addEventListener('submit' ,(e)=>{
     e.preventDefault();
     addTask();
})

