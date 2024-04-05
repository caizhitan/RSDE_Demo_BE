# RSDE_Demo_BE

###  System Architecture
<img width="1468" alt="image" src="https://github.com/caizhitan/RSDE_FE_Demo/assets/150103035/b6d1467d-3f3c-4f01-9da1-984e13bce45a">

###  System Flow
<img width="1388" alt="image-1" src="https://github.com/caizhitan/RSDE_FE_Demo/assets/150103035/286f7277-5a6c-48fe-88ea-cba168da4a1f">

### File Class Diagram
<img width="570" alt="image-2" src="https://github.com/caizhitan/RSDE_FE_Demo/assets/150103035/edd70f26-7e98-483b-b6e5-7cd6af9b39bb">

Our Front-End is built using TypeScript & React. With Sequalize an Object-Relational Mapping (ORM) library to manage our Back-End databases PostgreSQL. 

## Functionality

### Authentication:
- Users can securely log in using MSAL ([Microsoft Authentication Library](https://learn.microsoft.com/en-us/entra/identity-platform/msal-overview)).
- Backend handles the login request from MSAL and authenticate user
  
### Admin Features:
- Admins have the route access to upload files. These files become available for all users to view and download, facilitating easy sharing and access to resources outside of the government internet.
- Admins have the route access to delete uploaded files.

### General User Features:
- Users are able view and download files uploaded by the admin, paginated response of avaliable files is handled by the backend.
- Users are able to search and filter files by file type and file name. 

## Structure of this monorepo

The structure of this monoropo is inspired from: https://medium.com/@dandobusiness/setting-up-typescript-in-a-mono-repo-cd49a38d6030

## Migration with sequelize

The data model is verioned and seeded with the use of sequelize cli: https://sequelize.org/master/manual/migrations.html

## 3-layer architecuture

To loosely couple the project with clear funcationality, the idea can be referred from https://www.codementor.io/@evanbechtol/node-service-oriented-architecture-12vjt9zs9i and https://bytearcher.com/articles/node-project-structure/

## To run sequelize cli migration

Manual create schema in the target DB server, and set DB user as the owner of the newly created schema

## Docker Run Commands

Connect to local database

- cd RSDE_DTT
- Change .env BUILD=dev-sandbox to BUILD=development
- docker-compose up --build

Docker connect to AWS RDS Dev instance

- Change .env BUILD=development to BUILD=dev-sandbox
- docker-compose up --build

Push Image to ECR
Login to ECR (Make sure Aws configured in cli)

aws ecr get-login-password --region region | docker login --username AWS --password-stdin aws_account_id.dkr.ecr.region.amazonaws.com

Tag the image

docker tag <ImageID> <ECR image url>:tag

push to ECR

docker push <ECR image url>:tag

Refresh the ecr ashboard and can find the latest image

