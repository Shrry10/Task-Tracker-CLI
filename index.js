#!/usr/bin/env node

import inquirer from "inquirer";
import fs from "fs";

const taskfile = "./tasks.txt";
let count = 0;

if (!fs.existsSync(taskfile)) {
  fs.writeFileSync(taskfile, JSON.stringify([]));
}

let tasks = JSON.parse(fs.readFileSync(taskfile));

const saveTasks = async () => {
  fs.writeFileSync(taskfile, JSON.stringify(tasks, null, 2));
};

const addTask = async () => {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "taskinfo",
      message: "Enter the task: ",
    },
  ]);

  tasks.push({
    id: ++count,
    description: answers.taskinfo,
    status: "to-do",
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  saveTasks();
  console.log("new task added");
};

const updateTask = async () => {
  if (tasks.length == 0) {
    console.log("no tasks to update");
    return;
  }

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "taskindex",
      message: "Choose a task to update: ",
      choices: tasks.map((task, index) => ({
        name: task.description,
        value: index,
      })),
    },
    {
      type: "list",
      name: "option",
      message: "Choose one to update: ",
      choices: ["description", "status"],
    },
    {
      type: "input",
      name: "update",
      message: "Enter the update: ",
      validate: (input) => {
        return input.trim() !== "" ? true : "details cannot be empty";
      },
    },
  ]);

  let index = answers.taskindex;
  if (index >= 0 && index < tasks.length) {
    if (answers.option == "description") {
      tasks[index].description = answers.update;
    } else if (answers.option == "status") {
      tasks[index].status = answers.update;
    }
    saveTasks();
    console.log("updated");
  } else {
    console.log("Invalid index");
  }
};

const menu = async () => {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "option",
      message: "Select the action you want to perform: ",
      choices: [
        "add a task",
        "update a task",
        "delete a task",
        "list all tasks",
        "exit",
      ],
    },
  ]);

  if (answers.option == "add a task") {
    await addTask();
  } else if (answers.option == "update a task") {
    await updateTask();
  } else if (answers.option == "delete a task") {
    await deleteTask();
  } else if (answers.option == "lists all tasks") {
    await listTasks();
  } else if (answers.option == "exit") {
    process.exit();
  } else {
    console.log("invalid option");
  }

  menu();
};

menu();
