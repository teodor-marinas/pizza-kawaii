const { writeFile } = require("fs/promises");

const fileWriterAsync = async (filePath,newData) => {
    try {
        await writeFile(filePath,newData);
    } catch (error) {
        console.error(`File reading error: ${error.message}`);
    }
};

module.exports = fileWriterAsync;