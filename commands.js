require('dotenv').config();
const {capitalize, InstallGlobalCommands} = require('./utils.js');

// Get the game choices from game.js
function createCommandChoices() {
  const choices = getRPSChoices();
  const commandChoices = [];

  for (let choice of choices) {
    commandChoices.push({
      name: capitalize(choice),
      value: choice.toLowerCase(),
    });
  }

  return commandChoices;
}

// Simple test command
const TEST_COMMAND = {
  name: 'test',
  description: 'Basic command',
  type: 1,
};

// Command containing options
const CHALLENGE_COMMAND = {
  name: 'challenge',
  description: 'Challenge to a match of rock paper scissors',
  options: [
    {
      type: 3,
      name: 'object',
      description: 'Pick your object',
      required: true,
      choices: createCommandChoices(),
    },
  ],
  type: 1,
};

const SUMMARY_COMMAND = {
  name: 'summary',
  description: 'Summary of contents',
  type: 1,
};

const PING_COMMAND = {
  name: 'ping',
  description: 'Ping!',
  type: 1,
};

// command that allow users to input their topics
const USER_INPUT_COMMAND = {
  name: 'subscribe',
  description: 'Subscribe to a topic',
  options: [
    {
      type: 3,
      name: 'input',
      description: 'The user input',
      required: true,
    },
  ],
  type: 1,
};

const ALL_COMMANDS = [TEST_COMMAND, CHALLENGE_COMMAND, SUMMARY_COMMAND, PING_COMMAND, USER_INPUT_COMMAND];

InstallGlobalCommands(process.env.APP_ID, ALL_COMMANDS);
