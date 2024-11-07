const generateEmailTemplate = (employee) => {
    return `
        <html>
            <head>
                <style>
                    /* Thêm style cho email nếu cần */
                    .email-container {
                        font-family: Arial, sans-serif;
                        line-height: 1.5;
                    }
                    .email-header {
                        font-size: 18px;
                        font-weight: bold;
                        color: #333;
                    }
                    .email-body {
                        margin-top: 20px;
                        color: #555;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="email-header">Xin chào ${employee.tenNhanVien},</div>
                    <div class="email-body">
                        <p>Bạn đã được chọn để tham gia dự án với vai trò: ${employee.vaiTro}</p>
                        <p>Vui lòng kiểm tra lại chi tiết trong hệ thống quản lý công việc của chúng tôi.</p>
                        <p>Trân trọng,</p>
                        <p>Đội ngũ quản lý dự án</p>
                    </div>
                </div>
            </body>
        </html>
    `;
};
export default generateEmailTemplate;
