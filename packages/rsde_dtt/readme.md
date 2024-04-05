# rsde_dtt

## Environment Variables

Before you run the project, make sure to add these in the secret specified under RSDE_DTT_SM_ENV_SECRET or add them in your .env file.

| Name                                   | Required | Description                                                                                       |
| -------------------------------------- | -------- | ------------------------------------------------------------------------------------------------- |
| RSDE_DTT_SM_ENV_SECRET                 | Yes      | secret name in AWS secret manager. Stores your environment variables.                             |
| RSDE_DTT_SERVER_PORT                   | Yes      | Port number. Should be in 8000 range.                                                             |
| POSTMAN_RSDE_DTT_COLLECTION_ID         | No       | Postman collection for this project. Used to create/sync project documentation.                   |
| POSTMAN_RSDE_DTT_COLLECTION_ACCESS_KEY | No       | Access key of the Postman collection for this project. Used to create/sync project documentation. |
| RSDE_DTT_SCHEMA                        | Yes      | Database schema.                                                                                  |
| SERVER_DB_USER                         | Yes      | Database user role.                                                                               |
| SERVER_DB_PASSWORD                     | Yes      | Database password.                                                                                |
| SERVER_DB_NAME                         | Yes      | Database name.                                                                                    |
| SERVER_DB_HOST                         | Yes      | Datbase host.                                                                                     |
| SERVER_DIALECT                         | Yes      | Database dialect. Should be "postgres".                                                           |
| IS_TESTING                             | Yes      | To run test, this must be true. BUILD and NODE_ENV should also be "development".                  |
| BUILD                                  | Yes      | Either "production" or "development".                                                             |
| NODE_ENV                               | Yes      | Either "production" or "development".                                                             |

## Running locally

```
yarn dev
```
