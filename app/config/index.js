const config = {
    app: {
        port: process.env.PORT || 3000,
    },
    db: {
        uri: process.env.MONGODB_URI || "mongodb+srv://vuthaiha:270902@cluster0.6b63zkz.mongodb.net/?retryWrites=true&w=majority",
    }
};
module.exports = config;