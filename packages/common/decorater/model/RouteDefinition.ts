export interface RouteDefinition {
  // Path to our route
  path: string;
  // HTTP Request method (get, post, ...)
  requestMethod: string;
  // requestMethod: "get" | "post" | "delete" | "options" | "put";
  // Method name within our class responsible for this route
  methodName: string;
}
