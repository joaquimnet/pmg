module.exports = (plop) => {
  plop.setGenerator('model', {
    description: 'Creates a new model with optional REST CRUD api.',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What would you like to name this model?',
      },
      {
        type: 'confirm',
        name: 'rest',
        message: 'Would you like to add a service with REST endpoints?',
      },
    ],
    actions: (data) => {
      const actions = [
        {
          type: 'add',
          templateFile: 'templates/model.hbs',
          path: 'models/{{dashCase name}}.model.js',
        },
      ];

      if (data.rest) {
        actions.push({
          type: 'add',
          templateFile: 'templates/model-service.hbs',
          path: 'services/{{dashCase name}}/{{dashCase name}}.service.js',
        });
      }
      actions.push({
        type: 'append',
        templateFile: 'templates/log.hbs',
        path: './plop.log',
        data: { time: new Date().toISOString(), generator: 'model' },
      });

      return actions;
    },
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
        path: 'services/{{dashCase name}}/{{dashCase name}}.service.js',
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
