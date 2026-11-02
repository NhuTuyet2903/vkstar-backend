const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const aiService = require('../services/aiService');

exports.checkInWithCamera = async (req, res) => {
  try {
    const { imageBase64, employeeId } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ success: false, message: 'Dữ liệu hình ảnh không hợp lệ' });
    }

    const aiResult = await aiService.verifyFace(imageBase64, employeeId);

    if (!aiResult.isMatch || aiResult.isSpoof) {
      return res.status(401).json({
        success: false,
        message: aiResult.isSpoof ? 'Phát hiện giả mạo khuôn mặt!' : 'Không nhận diện được nhân viên'
      });
    }

    const user = await prisma.user.findUnique({ where: { employeeId: aiResult.employeeId } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Nhân viên không tồn tại trên hệ thống' });
    }

    const newAttendance = await prisma.attendance.create({
      data: {
        userId: user.id,
        confidence: aiResult.confidence,
        evidenceImg: aiResult.savedImagePath,
        status: aiResult.isLate ? 'LATE' : 'PRESENT'
      },
      include: { user: true }
    });

    req.io.emit('new-attendance', {
      employeeId: user.employeeId,
      fullName: user.fullName,
      checkInTime: newAttendance.checkInTime,
      status: newAttendance.status,
      evidenceImg: newAttendance.evidenceImg
    });

    return res.status(200).json({
      success: true,
      message: 'Chấm công thành công',
      data: newAttendance
    });

  } catch (error) {
    console.error('Error during check-in:', error);
    return res.status(500).json({ success: false, message: 'Lỗi hệ thống khi chấm công' });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const totalUsers = await prisma.user.count();
    const todayAttendances = await prisma.attendance.findMany({
      where: { checkInTime: { gte: today } },
      include: { user: true }
    });

    const presentCount = todayAttendances.filter(a => a.status === 'PRESENT').length;
    const lateCount = todayAttendances.filter(a => a.status === 'LATE').length;
    const absentCount = totalUsers - (presentCount + lateCount);

    return res.status(200).json({
      success: true,
      stats: {
        totalEmployees: totalUsers,
        presentToday: presentCount,
        lateToday: lateCount,
        absentToday: absentCount < 0 ? 0 : absentCount
      },
      recentLogs: todayAttendances.slice(0, 10)
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Lỗi tải dữ liệu thống kê' });
  }
};
