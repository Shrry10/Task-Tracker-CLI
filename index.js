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
      message: "Choose a field to update: ",
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

  const index = answers.taskindex;
  if (index >= 0 && index < tasks.length) {
    if (answers.option == "description") {
      tasks[index].description = answers.update;
    } else if (answers.option == "status") {
      tasks[index].status = answers.update;
    }
    tasks[index].updatedAt = Date.now();
    saveTasks();
    console.log("updated");
  } else {
    console.log("Invalid index");
  }
};

const deleteTask = async () => {
  if (tasks.length == 0) {
    console.log("no tasks to delete");
    return;
  }

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "taskindex",
      message: "Choose a task to delete: ",
      choices: tasks.map((task, index) => ({
        name: task.description,
        value: index,
      })),
    },
  ]);

  const index = answers.taskindex;
  if (index >= 0 && index < tasks.length) {
    tasks.splice(index, 1);
    saveTasks();
    console.log("deleted");
  } else {
    console.log("Invalid index");
  }
};

const listTasks = async () => {
  if (tasks.length == 0) {
    console.log("no tasks present");
    return;
  }

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "status",
      message: "Choose a status-type to list: ",
      choices: ["all", "done", "not-done", "in-progress"],
    },
  ]);

  console.log("list of the tasks (✗ => to-do, O => in-progress, ✓ => done): ");
  if (answers.status == "all") {
    tasks.forEach((task, index) => {
      let stat =
        task.status == "to-do" ? "✗" : task.status == "done" ? "✓" : "O";
      console.log(`${index + 1}. ${stat} ${task.description}`);
    });
  } else if (answers.status == "done") {
    let serial = 0;
    tasks.forEach((task, index) => {
      if (task.status == "done") {
        console.log(`${++serial}. ${task.description}`);
      }
    });
  } else if (answers.status == "not-done") {
    let serial = 0;
    tasks.forEach((task, index) => {
      if (task.status !== "done") {
        console.log(`${++serial}. ${task.description}`);
      }
    });
  } else if (answers.status == "in-progress") {
    let serial = 0;
    tasks.forEach((task, index) => {
      if (task.status == "in-progress") {
        console.log(`${++serial}. ${task.description}`);
      }
    });
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
        "list tasks",
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
  } else if (answers.option == "list tasks") {
    await listTasks();
  } else if (answers.option == "exit") {
    process.exit();
  } else {
    console.log("invalid option");
  }

  menu();
};

menu();
