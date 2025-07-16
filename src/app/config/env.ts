import dotenv from "dotenv"

dotenv.config()

interface EnvConfig {
    PORT:string;
    DB_URL:string;
    NODE_ENV:"development" | "production";
    JWT_ACCESS_SECRET:string;
    JWT_ACCESS_EXPIRE:string;
    JWT_REFRESH_SECRET:string;
    JWT_REFRESH_EXPIRE:string;
    BCRYPT_SALTROUND:string;
    SUPER_ADMIN_EMAIL:string;
    SUPER_ADMIN_PASSWORD:string
}

const loadEnvVariables = (): EnvConfig =>{
    const requiredEnvVariables : string[] = ["PORT", "DB_URL", "NODE_ENV", "JWT_ACCESS_SECRET", "JWT_ACCESS_EXPIRE", "BCRYPT_SALTROUND", "SUPER_ADMIN_PASSWORD", "SUPER_ADMIN_EMAIL", "JWT_REFRESH_SECRET", "JWT_REFRESH_EXPIRE"]

    requiredEnvVariables.forEach(key =>{
        if (!process.env[key]) {
            throw new Error (`Missing required environment variables ${key}`)
        }
    })

    return {
        PORT: process.env.PORT as string,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        DB_URL:process.env.DB_URL!,
        NODE_ENV:process.env.NODE_ENV as "development" | "production",
        JWT_ACCESS_SECRET:process.env.JWT_ACCESS_SECRET as string,
        JWT_ACCESS_EXPIRE: process.env.JWT_ACCESS_EXPIRE as string,
        BCRYPT_SALTROUND: process.env.BCRYPT_SALTROUND as string,
        SUPER_ADMIN_EMAIL:process.env.SUPER_ADMIN_EMAIL as string,
        SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
        JWT_REFRESH_SECRET:process.env.JWT_REFRESH_SECRET as string,
        JWT_REFRESH_EXPIRE:process.env.JWT_REFRESH_EXPIRE as string

    }
}


export const envVars = loadEnvVariables()