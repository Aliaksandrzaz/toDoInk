import {Model} from "./toDoModel";
import {Controller} from "./toDoContr";
import {eventEmitter} from "./eventEmitter";
import {polyfillAppend, polyfillMatches} from "./appendPolifill";

const elementClosest = require('element-closest');

export class View {
    constructor(controller, model) {
        this.monthNames = [
            "January", "February", "March",
            "April", "May", "June", "July",
            "August", "September", "October",
            "November", "December"
        ];

        this.model = new Model();
        this.controller = new Controller();

        this.wrapper = document.getElementById('wrapper');

        this.wrapperSideMenu = document.getElementById('sidebar-wrapper');
        this.btnSidebarWrapper = document.getElementById('menu-toggle');

        this.btnFiltrPriorityAll = document.querySelector('[data-priority="All"]');
        this.btnFiltrPriorityHight = document.querySelector('[data-priority="Hight"]');
        this.btnFiltrPriorityMedium = document.querySelector('[data-priority="Medium"]');
        this.btnFiltrPriorityLow = document.querySelector('[data-priority="Low"]');

        this.btnSort = document.querySelector('[data-sort]');

        this.btnDeleteTask = document.querySelectorAll('[data-delete]');
        this.btnEditTask = document.querySelectorAll('[data-edit]');
        this.btnCompletedTask = document.querySelectorAll('[data-completed]');

        this.formTask = document.getElementById('formTask');

        this.wrapperToDo = document.getElementById('wrapperToDo');

        this.toDoElement = document.getElementById('toDo');
        this.completedElement = document.getElementById('completed');

        this.btnTaskSave = document.getElementById('btnTaskSave');
        this.taskTime = document.getElementById('taskTime');
        this.taskHeader = document.getElementById('taskHeader');
        this.taskText = document.getElementById('taskText');
        this.taskPrior = document.getElementById('taskPrior');

        this.btnColorTask = document.getElementById('taskColor');

        this.wrapper.addEventListener('click', this);

        this.valueCountToDo = document.getElementById('countToDo');
        this.valueCountCompleted = document.getElementById('countCompleted');

        this.btnTile = document.getElementById('btnTile');
        this.btnRow = document.getElementById('btnRow');

        this.rowLocation = true;

        this.countToDo();
        this.timeNow();
        this.addNewTask();
        this.sortTasksTime();
        this.filterPriority();
        this.completedTask();

        this.controller.load();
    }

    handleEvent() {
        let element = event.target;
        this.dropdownTask(element);
        switch (element) {
            case this.btnSidebarWrapper:
                this.wrapperSideMenu.classList.toggle('collapse');
                return;
            case this.btnTaskSave:
                return this.controller.addTask(this.taskTime.textContent, this.taskPrior.value, this.taskText.value, this.taskHeader.value, this.btnColorTask.value, this.rowLocation);
            case this.btnCompletedTask:
                let completedTask = event.target.closest('.task');
                this.deleteTask(completedTask);
                this.controller.completedTask(completedTask);
                return;
            // case this.btnEditTask:
            // let editTask = event.target.closest('.task');
            // this.editTaskContainer = event.target.closest('.task');
            // this.taskTime.textContent = this.editTaskContainer.querySelector('[data-time]').textContent;
            // this.taskPrior.value = this.editTaskContainer.querySelector('[data-priority]').textContent;
            // this.taskText.value = this.editTaskContainer.querySelector('[data-text]').textContent;
            // this.taskHeader.value = this.editTaskContainer.querySelector('[data-header]').textContent;
            // this.btnColorTask.value =;
            // this.editTaskFlag = event.target.closest('.task');
            // this.controller.editTask(this.taskTime.textContent, this.taskPrior.value, this.taskText.value, this.taskHeader.value, this.btnColorTask.value);
            // return this.editTask(this.editTaskContainer);
            case this.btnDeleteTask:
                let deleteTask = event.target.closest('.task');
                this.controller.deleteTask(deleteTask);
                return this.deleteTask(deleteTask);
            case this.btnFiltrPriorityAll:
                return this.controller.filterPriority(element.dataset.priority);
            case this.btnFiltrPriorityHight:
                return this.controller.filterPriority(element.dataset.priority);
            case this.btnFiltrPriorityMedium:
                return this.controller.filterPriority(element.dataset.priority);
            case this.btnFiltrPriorityLow:
                return this.controller.filterPriority(element.dataset.priority);
            case this.btnSort:
                return this.controller.sortTime();
            case this.btnTile:
                this.rowLocation = false;
                return this.controller.elementLocation(this.rowLocation);
            case this.btnRow:
                this.rowLocation = true;
                return this.controller.elementLocation(this.rowLocation);
        }
    }

    dropdownTask(element) {
        if (element.dataset.delete === "deleteTask") {
            this.btnDeleteTask = event.target;
        }
        else if (element.dataset.completed === "completedTask") {
            this.btnCompletedTask = event.target;
        }
        else if (element.dataset.edit === "editTask") {
            this.btnEditTask = event.target;
        }
    }

    timeNow() {
        let time = new Date();
        this.taskTime.textContent = `${time.getDate()} ${this.monthNames[time.getMonth()]} ${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
        requestAnimationFrame(this.timeNow.bind(this));
    }

    addNewTask() {
        eventEmitter.subscribe('addTask', (text) => {
            this.toDoElement.append(text.text);
            this.formTask.reset();
        });
    }

    editTask() {

    }

    sortTasksTime() {
        eventEmitter.subscribe('sortTime', (text) => {
            this.toDoElement.append(text.sortedTimeToDo);
            this.completedElement.append(text.sortedTimeCompleted);
        });
    }

    filterPriority() {
        eventEmitter.subscribe('filterPriority', (text) => {

            while (this.toDoElement.childElementCount) {
                this.toDoElement.firstChild.remove();
            }

            while (this.completedElement.childElementCount) {
                this.completedElement.removeChild(this.completedElement.firstChild);
            }

            this.toDoElement.append(text.filteredPriorityToDo);
            this.completedElement.append(text.filteredPriorityCompleted);
        });
    }

    deleteTask(deleteTask) {
        deleteTask.remove();
    }

    completedTask() {
        eventEmitter.subscribe('completedTask', (text) => {
            this.completedElement.append(text.value[text.value.length - 1]);
        });
    }

    countToDo() {
        eventEmitter.subscribe('changeCountTask', (text) => {
            this.valueCountToDo.textContent = text.countToDo;
            this.valueCountCompleted.textContent = text.countCompleted;
        });
    }
}