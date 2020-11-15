module.exports = (plop) => {
  plop.setGenerator('model', {
    description: 'Creates a new model with optional REST CRUD api.',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What would you like to name this model?',
      },
    ],
    actions: [
      {
        type: 'add',
        templateFile: 'templates/model.hbs',
        path: 'src/models/{{name}}.model.js',
      },
      {
        type: 'add',
        templateFile: 'templates/model-service.hbs',
        path: 'src/services/{{dashCase name}}/{{name}}.service.js',
      },
      {
        type: 'append',
        templateFile: 'templates/log.hbs',
        path: './plop.log',
        data: { time: new Date().toISOString(), generator: 'model' },
      },
    ],
  });

  plop.setGenerator('service', {
    description: 'Creates a new empty service.',
    prompts: [
      { type: 'input', name: 'name', message: 'What would you like to name this service?' },
    ],
    actions: [
      {
        type: 'add',
        templateFile: 'templates/empty-service.hbs',
        path: 'src/services/{{dashCase name}}/{{dashCase name}}.service.js',
        skipIfExists: true,
      },
      {
        type: 'append',
        templateFile: 'templates/log.hbs',
        path: './plop.log',
        data: { time: new Date().toISOString(), generator: 'service' },
      },
    ],
  });
};
