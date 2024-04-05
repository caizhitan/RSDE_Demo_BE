import postmanToOpenApi from "postman-to-openapi";
import fetch from "node-fetch";

const loadDocs = async (
  postmanCollectionLink: string,
  openAPIOutputFileLocation: string,
  optionFileLocation: string
) => {
  try {
    console.log("Loading docs...");
    const options = require(optionFileLocation);

    // fetch Postman Collection JSON
    const response = await fetch(postmanCollectionLink);
    const postmanCollection = await response.text();
    // convert to OpenAPI specs and overwrite existing result.yml file. Return strigified output.
    await postmanToOpenApi(
      postmanCollection,
      openAPIOutputFileLocation,
      options
    );
    console.log("Docs loaded.");
  } catch (error) {
    console.log("Failed to load docs", error);
  }
};

export default loadDocs;
