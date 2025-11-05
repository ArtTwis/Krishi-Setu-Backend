## Version 1.0

- UserAuth
- post /api/v1/auth/create/:userType ( setDefaultPassword, createAdminUser )
- post /api/v1/auth/login ( loginUser )
- post /api/v1/auth/logout ( verifyJwtToken, logoutUser )
- post /api/v1/auth/refreshToken ( reGenerateAccessToken )
- put /api/v1/auth/change-password ( verifyJwtToken, changePassword )
