import {eventEmitter} from "./eventEmitter";

export class Model {
    constructor() {
        this.tasksToDo = [];
        this.tasksCompleted = [];
        this.countTimeSort = 1;
        this.historyTodo = [];
        this.historyCompleted = [];
    }

    template(taskTime, taskPrior, taskText, taskHeader, taskColor) {
        let task = document.createElement('div');
        let className = ['container-fluid', 'm-1', 'task'];
        className.forEach((el)=>{
            task.classList.add(el);
        });
        task.id = Date.now();
        this.textTask = `
            <div class="row justify-content-center  align-items-center bg-info m-1">
                <div class="col-md m-2">
                    <div class="container justify-content-center align-items-center ">  
                        <div class="row justify-content-center">
                            <div class="column rounded-circle ${taskColor} color-circle"></div> 
                        </div>   
                                     
                    </div>
                </div>            
                <div class="col-md-9 m-2">            
                    <div class="row justify-content-end">
                        <div class="column mr-3" data-time = ${Date.now()}>${taskTime}</div>
                        <div class="column mr-3" data-priority="${taskPrior}">${taskPrior}</div>
                    </div>            
                    <div class="row ">            
                        <div class="row w-100 mb-3">
                            <div class="col" data-header>${taskHeader}</div>
                         </div>
                        <div class="row w-100 mb-3">
                            <div class="col" data-text>${taskText}</div>
                        </div>            
                    </div>            
                </div>           
                <div class="col-md m-2 ">
                <div class="row justify-content-center">
                <div class="dropdown dropleft">
                        <button class="btn btn-secondary dropdown-toggle comma-dropdown" type="button" id="dropdownMenu2" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                          
                        </button>
                        
                        <div class="dropdown-menu" aria-labelledby="dropdownMenu2">                        
                          <button class="dropdown-item" type="button" data-delete="deleteTask">Delete</button>
                          <button class="dropdown-item" type="button" data-edit="editTask" data-toggle="modal"
                                data-target="#basicExampleModal">Edit</button>
                          <button class="dropdown-item" type="button" data-completed="completedTask">Completed</button>
                        </div>
                    </div>
                </div>
                    
                </div>
            </div>`;

        task.innerHTML = this.textTask;

        return task;
    }


    tile(){

    }

    countToDo() {
        eventEmitter.emit('changeCountTask', {
            countToDo: this.tasksToDo.length,
            countCompleted: this.tasksCompleted.length
        });
    }

    completedTask(completedTask) {
        this.tasksCompleted.push(completedTask);
        completedTask.querySelector('[data-edit]').disabled = true;
        completedTask.querySelector('[data-completed]').disabled = true;
        eventEmitter.emit('completedTask', {value: this.tasksCompleted});
        this.countToDo();
    }

    edit(editTask) {
        this.tasksToDo.find((el) => {
            if (el === editTask) {
                return el;
            }
        });
    }

    deleteTask(deleteTask) {
        let numberDeleteTask;
        this.tasksToDo.forEach((el, index) => {
            if (el.textContent === deleteTask.textContent) {
                numberDeleteTask = index;
            }
        });

        this.tasksToDo.splice(numberDeleteTask, 1);
        this.countToDo();

        this.deleteItemStorageToDo(numberDeleteTask);
    }

    deleteTaskCompleted(deleteTask) {
        let numberDeleteTaskCompleted;
        this.tasksCompleted.forEach((el, index) => {
            if (el.textContent === deleteTask.textContent) {
                numberDeleteTaskCompleted = index;
            }
        });
        this.tasksCompleted.splice(numberDeleteTaskCompleted, 1);
        this.countToDo();
        this.deleteItemStorageCompleted(numberDeleteTaskCompleted);
    }

    sortTime() {
        this.tasksToDo.sort(this.sortTimeArray.bind(this));
        this.tasksCompleted.sort(this.sortTimeArray.bind(this));

        this.countTimeSort++;
        let sortedTasksToDo = this.tasksToDo.reduce((acc, el) => {
            acc.append(el);
            return acc;
        }, document.createDocumentFragment(), 0);
        let sortedTasksCompleted = this.tasksCompleted.reduce((acc, el) => {
            acc.append(el);
            return acc;
        }, document.createDocumentFragment(), 0);

        eventEmitter.emit('sortTime', {
            sortedTimeToDo: sortedTasksToDo,
            sortedTimeCompleted: sortedTasksCompleted
        });
    }

    sortTimeArray(a, b) {
        if (this.countTimeSort % 2 === 0) {
            return Number(a.querySelector('[data-time]').dataset.time) - Number(b.querySelector('[data-time]').dataset.time);
        }
        else {
            return Number(b.querySelector('[data-time]').dataset.time) - Number(a.querySelector('[data-time]').dataset.time);
        }
    }


    filterPriority(typePriority) {
        let filteredPriorityTodo = this.tasksToDo.reduce((acc, el) => {
            if (el.querySelector(`[data-priority=${typePriority}]`)) {
                acc.append(el);
                return acc;
            }
            else if (typePriority === "All") {
                acc.append(el);
            }
            return acc;
        }, document.createDocumentFragment());

        let filteredPriorityCompleted = this.tasksCompleted.reduce((acc, el) => {
            if (el.querySelector(`[data-priority=${typePriority}]`)) {
                acc.append(el);
                return acc;
            }
            else if (typePriority === "All") {
                acc.append(el);
            }
            return acc;
        }, document.createDocumentFragment(), 0);

        eventEmitter.emit('filterPriority', {
            filteredPriorityToDo: filteredPriorityTodo,
            filteredPriorityCompleted: filteredPriorityCompleted
        });
    }

    addTask(taskTime, taskPrior, taskText, taskHeader, taskColor) {
        let task = this.template(taskTime, taskPrior, taskText, taskHeader, taskColor);
        this.tasksToDo.push(task);
        this.countToDo();
        this.save(taskTime, taskPrior, taskText, taskHeader, taskColor);
        eventEmitter.emit('addTask', {text: task});
    }

    save(taskTime, taskPrior, taskText, taskHeader, taskColor) {
        let taskSaveElement = [taskTime, taskPrior, taskText, taskHeader, taskColor];
        this.historyTodo.push(taskSaveElement);
        localStorage.setItem('toDo', JSON.stringify(this.historyTodo));
    }

    load() {
        let taskLoadElement = localStorage.getItem('toDo');
        let taskLoad = JSON.parse(taskLoadElement);

        if (taskLoad !== null) {
            taskLoad.forEach((el) => {
                this.addTask(el[0], el[1], el[2], el[3], el[4]);
            });
        }


        taskLoadElement = localStorage.getItem('completed');
        taskLoad = JSON.parse(taskLoadElement);

        if (taskLoad !== null) {
            taskLoad.forEach((el) => {
                let completedTask = this.template(el[0], el[1], el[2], el[3], el[4]);
                this.tasksCompleted.push(completedTask);

                let taskSaveElement = [el[0], el[1], el[2], el[3], el[4]];
                this.historyCompleted.push(taskSaveElement);
                localStorage.setItem('completed', JSON.stringify(this.historyCompleted));
                eventEmitter.emit('completedTask', {value: this.tasksCompleted});
                this.countToDo();
            });
        }

    }

    deleteItemStorageToDo(numberDeleteTask) {
        this.historyTodo.splice(numberDeleteTask, 1);
        localStorage.setItem('toDo', JSON.stringify(this.historyTodo));
    }

    deleteItemStorageCompleted(numberDeleteTask) {
        this.historyCompleted.splice(numberDeleteTask, 1);
        localStorage.setItem('completed', JSON.stringify(this.historyCompleted));
    }

    saveCompleted(numberTask) {
        let numberToDoTask;
        this.tasksToDo.forEach((el, index) => {
            if (el.textContent === numberTask.textContent) {
                numberToDoTask = index;
            }
        });
        this.historyCompleted.push(this.historyTodo[numberToDoTask]);
        localStorage.setItem('completed', JSON.stringify(this.historyCompleted));
    }
}

