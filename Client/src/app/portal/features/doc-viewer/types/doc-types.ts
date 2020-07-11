export class ApiActionDoc {
  relativePath: string;
  httpMethod: string;
  description: string;
  routeParams: ApiParameterDoc[];
  queryParams: ApiParameterDoc[];
  headerParams: ApiParameterDoc[];
  responseDocs: ApiResponseDoc[];
}

export class ApiEmbeddedDoc {
  embeddedName: string;
  isCollection: boolean;
  resourceDoc: ApiResourceDoc;
}

export class ApiParameterDoc {
  name: string;
  type: string;
  defaultValue: string;
  isOptional: boolean;
  description: string;
}

export class ApiPropertyDoc {
  name: string;
  description: string;
  isObject: boolean;
  isArray: boolean;
  isRequired: boolean;
}

export class ApiRelationDoc {
  name: string;
  method: string;
  hRef: string;
  description: string;
}

export class ApiResourceDoc {
  description: string;
  resourceName: string;
  properties: ApiPropertyDoc[];
  embeddedResourceDocs: ApiEmbeddedDoc[];
  relationDocs: ApiRelationDoc[];
}

export class ApiResponseDoc {
  status: number;
  resourceDoc: ApiResourceDoc;
}
