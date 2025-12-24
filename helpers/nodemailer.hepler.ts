import nodemailer from 'nodemailer';

export const sendEmail = async (emailUser: string, html: any, subject: string) => {
  // 1. Khởi tạo transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, 
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASSWORD,
    }
  });

  // 2. Cấu hình mail options
  const mailOptions = {
    from: `"Tên Ứng Dụng" <${process.env.APP_EMAIL}>`, // Thêm format để chuyên nghiệp hơn
    to: emailUser,
    subject: subject,
    html: html
  };

  // 3. Sử dụng try/catch bên trong để bắt lỗi SMTP
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ', info.response);
    return info; // Trả về info để Controller biết là đã xong
  } catch (error) {
    console.error('Lỗi SMTP:', error);
    throw error; // Quan trọng: Phải throw lỗi để Controller catch được
  }
};