export const config = {
  user_route_config: {
    exclude_jwt_check: [],
    optional_jwt_check: [],
  },
  file_route_config: {
    exclude_jwt_check: ["getAllFile", "getPaginatedFile", "deleteFile", "postFile", "editFile", "getFilteredFile", "getSearchedFile", "getUrl", "openFile", "deleteS3File"],
    optional_jwt_check: [],
  },
};
