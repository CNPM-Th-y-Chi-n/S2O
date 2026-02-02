from werkzeug.security import generate_password_hash

# Tạo mã hash cho mật khẩu 123
new_hash = generate_password_hash('123')
print(f"\nCopy chuỗi này vào SQL:\n{new_hash}\n")