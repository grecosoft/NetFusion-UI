import {ApiConnection} from '../../../../types/connection-types';

export class MessageLog {
  // Header Properties:
  correlationId: string;
  dateOccurred: Date;
  dateLogged: Date;
  context: string;
  messageType: string;
  connectionName: string;
  hint: string;

  // Detail Properties:
  message: any;
  details: { [name: string]: string };
  errors: { [name: string]: string };
}
