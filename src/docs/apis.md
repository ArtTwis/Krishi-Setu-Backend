## Version 1.0

- AdminAuth
- post /api/v1/auth/admin/register ( validateRequest, attachRole, registerAccount )
- post /api/v1/admin/verify/:token ( validateRequest, attachRole, verifyAccount )
- post /api/v1/auth/admin/login ( validateRequest, attachRole, loginAccount )
- post /api/v1/auth/admin/logout ( validateRequest, attachRole, verifyJwtToken, logoutAccount )
- post /api/v1/auth/admin/regenerateToken ( attachRole, reGenerateAccessToken )

- UserAuth
- post /api/v1/auth/user/register ( validateRequest, attachRole, registerAccount )
- post /api/v1/user/verify/:token ( validateRequest, attachRole, verifyAccount )
- post /api/v1/auth/user/login ( validateRequest, attachRole, loginAccount )
- post /api/v1/auth/user/logout ( validateRequest, attachRole, verifyJwtToken, logoutAccount )
- post /api/v1/auth/user/regenerateToken ( attachRole, reGenerateAccessToken )
