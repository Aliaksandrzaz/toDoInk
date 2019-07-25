import {Model} from "./toDoModel";

export class Controller {
    constructor() {
        this.model = new Model();
    }

    addTask(taskTime, taskPrior, taskText, taskHeader, taskColor) {
        if (taskTime, taskPrior, taskText, taskHeader, taskColor) {
            this.model.addTask(taskTime, taskPrior, taskText, taskHeader, taskColor);
        }
    }

    load() {
        this.model.load();
    }

    editTask(taskTime, taskPrior, taskText, taskHeader, taskColor) {

    }

    filterPriority(typePriority) {
        this.model.filterPriority(typePriority);
    }

    sortTime() {
        this.model.sortTime();
    }

    deleteTask(deleteTask) {
        if (deleteTask.closest('#toDo')) {
            this.model.deleteTask(deleteTask);
        }
        else {
            this.model.deleteTaskCompleted(deleteTask);
        }
    }

    completedTask(completedTask) {
        this.model.saveCompleted(completedTask);

        this.model.completedTask(completedTask);
        this.model.deleteTask(completedTask);
    }
}