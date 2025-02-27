# RSDE_Demo_BE

###  System Architecture
<img width="1468" alt="image" src="https://github.com/caizhitan/RSDE_FE_Demo/assets/150103035/b6d1467d-3f3c-4f01-9da1-984e13bce45a">

- Using an ExpressJS as part of the node ecosystem to handle backend requests
- Using postgreSQL to store structured data
- Using S3 bucket in AWS to store meta data (PDF and EXCEL files)
- With Sequalize an Object-Relational Mapping (ORM) library to manage our Back-End databases PostgreSQL. 

### File Class Diagram
<img width="570" alt="image-2" src="https://github.com/caizhitan/RSDE_FE_Demo/assets/150103035/edd70f26-7e98-483b-b6e5-7cd6af9b39bb">

- RSDE_BE uses Typescript for Type Safety, this allows for a more robust backend and for maintainance to track variables in the system
- Using MVCS architecture for the structure of the backend

## Functionality

### Authentication:
- Users can securely log in using MSAL ([Microsoft Authentication Library](https://learn.microsoft.com/en-us/entra/identity-platform/msal-overview)).
- Backend handles the login request from MSAL and Authenticates the user
  
### Admin Features:
- Admins have the route access to upload files. These files become available for all users to view and download, facilitating easy sharing and access to resources outside of the government internet.
- Admins have the route access to delete uploaded files.

### General User Features:
- Users are able view and download files uploaded by the admin, paginated response of avaliable files is handled by the backend.
- Users are able to search and filter files by file type and file name.

### Sercurity
- To open a file, the frontend does a request to the backend and through AWS's api the file will be transfered from the server back to the user
- Prevents api key from being exposed.

## Structure of this monorepo

The structure of this monoropo is inspired from: https://medium.com/@dandobusiness/setting-up-typescript-in-a-mono-repo-cd49a38d6030

## Migration with sequelize

The data model is verioned and seeded with the use of sequelize cli: https://sequelize.org/master/manual/migrations.html

## 3-layer architecuture

To loosely couple the project with clear funcationality, the idea can be referred from https://www.codementor.io/@evanbechtol/node-service-oriented-architecture-12vjt9zs9i and https://bytearcher.com/articles/node-project-structure/

## AWS EC2 and PM2 Logging Demo

[![Watch the video](https://github.com/caizhitan/RSDE_Demo_BE/assets/150103035/4e4fa51a-6e5c-4f84-b504-8a33d92426f4)](https://www.youtube.com/watch?v=LcoNZ7wDtE0)

