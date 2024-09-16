import Ajv from 'ajv';
import addFormats from 'ajv-formats';
let ajvClient: Ajv;

export const getAjvClient = () => {
  if (ajvClient == undefined) {
    ajvClient = new Ajv();
    addFormats(ajvClient);
  }
  return ajvClient;
};
