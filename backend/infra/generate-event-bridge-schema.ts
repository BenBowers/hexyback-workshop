export const generateEventBridgeSchema = () => {
  return {
    'openapi': '3.0.1',
    'info': {
      'version': '1.0.0',
      'title': 'event-bridge-schema'
    },
    'paths': {},
    'components': {
      'schemas': {
        'CreateBorrowerProfile': {
          'type': 'object',
          'required': [
            'name', 'dob', 'email', 'creditScore'
          ],
          'properties': {
            'name': {
              'type': 'string'
            },
            'email': {
              'type': 'string'
            },
            'dob': {
              'type': 'string',
              'description':
            'Borrowers date of birth in ISO8601 date string format',
              'example': '1990-01-01',
              'pattern': '^(\\d{4}-\\d{2}-\\d{2})$'
            },
            'creditScore': {
              'type': 'integer',
              'minimum': 0,
              'maximum': 1000
            }
          }
        }
      }
    }
  };
};