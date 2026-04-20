import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Home.css';
import './Auth.css';
import { 
MdNoteAlt, MdVisibility, MdVisibilityOff, MdLock 
} from "react-icons/md";

function ResetPassword() {
const navigate = useNavigate();
const [searchParams] = useSearchParams();
const email = searchParams.get('email');
const token = searchParams.get('token');

const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
});

const [showPassword, setShowPassword] = useState(false);


const [errors, setErrors] = useState({
    password: '',
    confirmPassword: ''
});

const validatePassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(password);
};
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = { password: '', confirmPassword: '' };

    if (!validatePassword(formData.password)) {
    newErrors.password = "Ít nhất 8 ký tự, có chữ hoa và số";
    }

    if (formData.password !== formData.confirmPassword) {
    newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    setErrors(newErrors);

    // nếu còn lỗi thì dừng
    if (newErrors.password || newErrors.confirmPassword) return;

    console.log("Reset:", email, token);
    alert("Đổi mật khẩu thành công!");
    navigate('/login');
};

return (
    <div className="auth-container">
    <div className="auth-card" style={{ maxWidth: '400px' }}>
        
        <div className="auth-logo">
        <MdNoteAlt size={30} />
        </div>

        <h3 className="auth-title">Đặt lại mật khẩu</h3>
        <p className="auth-subtitle mb-4">
        Tạo mật khẩu mới cho tài khoản của bạn
        </p>

        <form onSubmit={handleSubmit}>

        {/* PASSWORD */}
        <div className="mb-3">
            <label className="form-label">Mật khẩu mới</label>

            <div className="position-relative">
            {/* icon trái */}
            <MdLock 
                className="position-absolute top-50 translate-middle-y start-0 ms-3 input-icon-left" 
            />

            <input 
                type={showPassword ? "text" : "password"}
                className="form-control form-control-pro ps-5 pe-5"
                placeholder="8+ ký tự, có chữ hoa & số"
                value={formData.password}
                onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
                }
            />

            {/* icon phải */}
            <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </button>
            </div>

            {/* lỗi ngay dưới */}
            {errors.password && (
            <div className="text-danger mt-1" style={{ fontSize: '13px' }}>
                {errors.password}
            </div>
            )}
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="mb-4">
            <label className="form-label">Xác nhận mật khẩu</label>

            <div className="position-relative">
            <MdLock 
                className="position-absolute top-50 translate-middle-y start-0 ms-3 input-icon-left" 
            />

            <input 
                type={showConfirmPassword ? "text" : "password"}
                className="form-control form-control-pro ps-5 pe-5"
                placeholder="Nhập lại mật khẩu"
                value={formData.confirmPassword}
                onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
                }
            />

            {/* 👁 icon mắt */}
            <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
            >
                {showConfirmPassword ? <MdVisibilityOff /> : <MdVisibility />}
            </button>
            </div>

            {/* lỗi ngay dưới */}
            {errors.confirmPassword && (
            <div className="text-danger mt-1" style={{ fontSize: '13px' }}>
                {errors.confirmPassword}
            </div>
            )}
        </div>

        <button type="submit" className="btn-auth">
            Cập nhật mật khẩu
        </button>
        </form>
    </div>
    </div>
);
}

export default ResetPassword;