import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./style/main.scss";
import {View} from "./scripts/toDoView";
import {Controller} from "./scripts/toDoContr";
import {Model} from "./scripts/toDoModel";

let model = new Model();
let controller = new Controller(model);
let view = new View(controller, model);


