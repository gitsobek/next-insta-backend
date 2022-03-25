// @ts-ignore
import { name, version, description } from '../../package.json';
import * as swaggerJSDoc from 'swagger-jsdoc';

const swaggerExpressOptions: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: name,
      version,
      description,
    },
  },
  apis: ['swagger.yaml'],
};

export default swaggerExpressOptions;
