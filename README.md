# Krishi-Setu-Backend

<br />

<img src="./src/assets/images/KrishiSetu.png"  width="300" />

<br />

AgriTrack is a Node.js-based backend application designed to store, manage, and track farmer records. The system helps in maintaining personal details, land ownership, crop cultivation, financial information, bank loans, and government scheme benefits in a structured digital format.

## Features

- Farmer personal & family details management
- Contact and address information with location mapping
- Bank account details with loan and credit tracking
- Land ownership, soil type, irrigation source, and crop records
- Financial limits, outstanding balances, and subsidy tracking
- Assets & equipment management (tractors, storage, vehicles)
- Insurance and government schemes integration
- REST API endpoints for easy integration with mobile/web apps

## Tech Stack

- **Node.js** with **Express.js** (Backend framework)
- **MongoDB / PostgreSQL** (Database for farmer records)
- **Sequelize/Mongoose** (ORM/ODM)
- **JWT Authentication** for security
- **Swagger** for API documentation

## Use Cases

- Digital farmer record keeping

> **Rest API's implementation for the veda application**

## ER Diagram

> [DB Models - ER Diagram](./Z-Krishi-setu-backend-ER-diagram-code.svg)

> [ER Diagram code file](./Z-Krishi-setu-backend-ER-diagram-code.txt)

## Version 1.0

- AdminAuth
- post /api/v1/auth/admin/register ( validateRequest, attachRole, registerAccount )
- post /api/v1/admin/verify/:token ( validateRequest, attachRole, verifyAccount )
- post /api/v1/auth/admin/login ( validateRequest, attachRole, loginAccount )
- post /api/v1/auth/admin/logout ( validateRequest, attachRole, verifyJwtToken, logoutAccount )
- post /api/v1/auth/admin/regenerateToken ( attachRole, reGenerateAccessToken )
- put /api/v1/auth/admin/change-password ( validateRequest, attachRole, verifyJwtToken, changePassword )

- UserAuth
- post /api/v1/auth/user/register ( validateRequest, attachRole, registerAccount )
- post /api/v1/user/verify/:token ( validateRequest, attachRole, verifyAccount )
- post /api/v1/auth/user/login ( validateRequest, attachRole, loginAccount )
- post /api/v1/auth/user/logout ( validateRequest, attachRole, verifyJwtToken, logoutAccount )
- post /api/v1/auth/user/regenerateToken ( attachRole, reGenerateAccessToken )
- put /api/v1/auth/user/change-password ( validateRequest, attachRole, verifyJwtToken, changePassword )

## Version 2.0

- AdminAuth
- /api/v1/auth/admin/forgot-password
- /api/v1/auth/admin/reset-password

- UserAuth
- /api/v1/auth/admin/forgot-password
- /api/v1/auth/admin/reset-password
