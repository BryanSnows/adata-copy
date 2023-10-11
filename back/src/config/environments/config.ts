
export default () => ({
    application: {
        api_url: process.env.APP_API_URL,
        port: parseInt(process.env.APP_PORT)
    },
    swagger: {
        title: process.env.SWAGGER_TITLE,
        description: process.env.SWAGGER_DESCRIPTION,
        version: process.env.SWAGGER_VERSION
    },
    auth: {
        token_secret: process.env.JWT_SECRET,
        token_expires_in: process.env.JWT_EXPIRES_IN,
        refresh_token_secret:  process.env.JWT_REFRESH_TOKEN_SECRET,
        refresh_token_expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
        first_access_token_secret: process.env.JWT_FIRST_ACCESS_SECRET,
        first_access_token_expires_in: process.env.JWT_FIRST_ACCESS_EXPIRES_IN,
    },
    database: {
        type: process.env.DB_TYPE,
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        schema:`${process.env.DB_DATABASE}.dbo`,
        entities: ['dist/**/*.entity{.ts,.js}'],
        logging: false,
        synchronize: false,
        extra: {
            trustServerCertificate: true,
        }
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        ttl: process.env.REDIS_TTL
    },
    mes: {
        api_url: process.env.MES_API_URL || `${process.env.SWAGGER_API_URL}/v1/mes-api`,
        api_token: process.env.MES_API_TOKEN
    }
});