import os
import sys

# Đảm bảo Python nhận diện được thư mục gốc
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from src.app import create_app

if __name__ == '__main__':
    app = create_app()
    print("\n---------------------------------------------------------")
    print("🚀 SERVER ĐANG KHỞI ĐỘNG TẠI: http://0.0.0.0:5000")
    print("---------------------------------------------------------\n")
    app.run(host='0.0.0.0', port=5000, debug=True)