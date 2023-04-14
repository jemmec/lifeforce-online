const customGenerationFunction = () =>
    (Math.random().toString(36) + "00000000").substr(2, 8);

const config = {
    port: 3001,
    path: "",
    key: "password",
    generateClientId: customGenerationFunction,
}

module.exports = config;