const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const xlsx = require("xlsx");

async function loadUserGroupAnalysis(excelFilePath) {
  try {
    const workbook = xlsx.readFile(excelFilePath);

    const rolesSheet = workbook.Sheets["userGroupAnalysis"];
    const rolesData = xlsx.utils.sheet_to_json(rolesSheet);

    try {
      await prisma.userGroupAnalysis.deleteMany().then(async () => {
        await prisma.userGroupAnalysis.createMany({
          data: rolesData,
        });
      });
    } catch (error) {
      console.log(error);
    }

    console.log(`userGroupAnalysis загружены в DB (${rolesData.length})`);
  } catch (error) {
    console.error(error);
  }
}

module.exports = loadUserGroupAnalysis;
