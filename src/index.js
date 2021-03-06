import program from 'commander';

import { validateInputArray, validateBaseName, validateName, validateParams, validateProject } from './utils/utils';

import { compareNeuralNetworkCommand } from './commandsLogic/compare';
import { createProjectStructure } from './commandsLogic/init';
import { runNeuralNetworkCommand } from './commandsLogic/run';
import { testNeuralNetworkCommand } from './commandsLogic/test';
import { trainAndCreateNeuralNetwortCommand } from './commandsLogic/create';

import { Print } from './utils/print';


let command = false;
const print = new Print();

program.version('1.1.4');

program
    .command('init [name]')
    .option('-v, --verbose', 'show info details')
    .description('Create a new neuraldeep project')
    .action( (name, option) => {
        command = true;
        if(!validateParams(name)){
            print.error('ERROR: Missing parameters');
            process.exit(2);
        }
        if(!validateBaseName(name)) {
            print.error('ERROR: Name invalid. The project name must have the camelCase syntax');
            process.exit(3);
        }
        try {
            createProjectStructure(name, option.verbose);
        } catch (error) {
            print.error('ERROR: ' + error.message);
        }
    });

program
    .command('create [name] [architecture...]')
    .option('-v, --verbose', 'show info details')
    .description('Create a trained neural network with training data file')
    .action( (name, architecture, option) => {
        command = true;
        if(!validateProject()) {
            print.error('ERROR: Go to the root of the project');
            process.exit(1);
        }
        if(!validateParams(name, architecture)){
            print.error('ERROR: Missing parameters');
            process.exit(2);
        }
        if(!validateName(name)) {
            print.error('ERROR: Name invalid. The name must have the following syntax: nameCase_versionCamelCase or only nameCamelCase');
            process.exit(3);
        }
        if (architecture.length < 3) {
            print.error('ERROR: Architecture invalid. The architecture must have three or more layers');
            process.exit(3);
        }
        if(!trainAndCreateNeuralNetwortCommand(name, architecture, option.verbose)){
            print.error('ERROR: Make sure you have the training data file in its respective folder');
            process.exit(4);
        }
    });

program
    .command('run [name] [input]')
    .option('-v, --verbose', 'show info details')
    .description('Run a neural network with a input')
    .action( (name, input, option) => {
        command = true;
        if(!validateProject()) {
            print.error('ERROR: Go to the root of the project');
            process.exit(1);
        }
        if(!validateParams(name, input)){
            print.error('ERROR: Missing parameters');
            process.exit(2);
        }
        if(!validateName(name)) {
            print.error('ERROR: Name invalid. The name must have the following syntax: nameCase_versionCamelCase or only nameCamelCase');
            process.exit(3);
        }
        if(!validateInputArray(input)) {
            print.error('ERROR: Input invalid. The input must be a binary array');
            process.exit(3);
        }
        if(!runNeuralNetworkCommand(name, input, option.verbose)){
            print.error('ERROR: Make sure you have run the create command');
            process.exit(4);
        }
    });

program
    .command('test [name]')
    .option('-v, --verbose', 'show info details')
    .option('-e, --extensive', 'Show tests with error')
    .description('Test a neural network with test data file')
    .action( (name, option) => {
        command = true;
        if(!validateProject()) {
            print.error('ERROR: Go to the root of the project');
            process.exit(1);
        }
        if(!validateParams(name)){
            print.error('ERROR: Missing parameters');
            process.exit(2);
        }
        if(!validateName(name)) {
            print.error('ERROR: Name invalid. The name must have the following syntax: nameCase_versionCamelCase or only nameCamelCase');
            process.exit(3);
        }
        if(!testNeuralNetworkCommand(name, option.extensive, option.verbose)){
            print.error('ERROR: Make sure you have run the create command or have the test data file in your respective folder');
            process.exit(4);
        }
    });

program
    .command('compare [baseName]')
    .option('-t, --top <items>', 'Show the betters neural networks')
    .option('-v, --verbose', 'Show info details')
    .description('Compare the performance and the error rate of two or more neural networks')
    .action((baseName, option) => {
        command = true;
        if (!validateProject()) {
            print.error('ERROR: Go to the root of the project');
            process.exit(1);
        }
        if (!validateParams(baseName)) {
            print.error('ERROR: Missing parameters');
            process.exit(2);
        }
        if (!validateBaseName(baseName)) {
            print.error('ERROR: Base name invalid. The name must have camelCase syntax');
            process.exit(3);
        }
        if (!compareNeuralNetworkCommand(baseName, option.top, option.verbose)) {
            print.error('ERROR: Make sure you have two or more neural networks or have the test data file in your respective folder');
            process.exit(4);
        }
    });

program.parse(process.argv);

if(!command){
    print.error('ERROR: No command given');
}