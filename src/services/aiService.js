const fs = require('fs');
const path = require('path');

exports.verifyFace = async (imageBase64, employeeId) => {
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
  const fileName = `evidence_${Date.now()}.png`;
  const uploadDir = path.join(__dirname, '../../uploads');

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const uploadPath = path.join(uploadDir, fileName);
  fs.writeFileSync(uploadPath, base64Data, 'base64');

  return {
    isMatch: true,
    isSpoof: false,
    confidence: 0.985,
    employeeId: employeeId || 'VK001',
    savedImagePath: `/uploads/${fileName}`,
    isLate: new Date().getHours() >= 9
  };
};
