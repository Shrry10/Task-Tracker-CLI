#!/usr/bin/env node

import inquirer from "inquirer";

console.log("Hello, CLI!");

const menu = async () => {
  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "username",
      message: "Choose your identification:",
      choices: ["Yash", "Shreyas"],
    },
  ]);

  console.log(`Hello ${answers.username}`);
};

menu();
