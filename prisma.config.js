

module.exports = {
    schema: "./prisma/schema.prisma",
    datasource: {
        ul : process.env.DATABASE_URL,
        directUrl: process.env.DIRECT_URL
    }
}
