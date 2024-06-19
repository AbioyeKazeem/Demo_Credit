// dbConfig.ts

interface KnexConfig {
    development: {
      client: string;
      connection: {
        host: string;
        user: string;
        password: string;
        database: string;
        charset: string;
      };
      migrations: {
        directory: string;
      };
      seeds: {
        directory: string;
      };
    };
    // Add configurations for other environments if necessary (e.g., production, testing)
  }
  
  export default KnexConfig;
  