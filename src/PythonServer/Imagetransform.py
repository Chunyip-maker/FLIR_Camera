from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import numpy as np
from PIL import Image
import io
import base64
import os

app = Flask(__name__)
CORS(app)  # 允许所有来源的跨域请求

@app.route('/upload_image_RGB', methods=['POST'])
def upload_image_RGB():
    data = request.json
    if 'image' not in data:
        return jsonify({'error': 'No image provided'}), 400

    # 解码Base64图像
    image_data = data['image']
    if ',' in image_data:
        image_data = image_data.split(',')[1]  # 删除前缀
    
    image_data = base64.b64decode(image_data)
    image = Image.open(io.BytesIO(image_data)).convert('RGB')
    
    # 转换为NumPy数组
    rgb_matrix = np.array(image)

    # 保存为CSV文件
    csv_path = 'rgb_matrix.csv'
    np.savetxt(csv_path, rgb_matrix.reshape(-1, 3), delimiter=',', fmt='%d')

    return send_file(csv_path, as_attachment=True, download_name='rgb_matrix.csv')

def fft(image):
    # Fast Fourier transform
    f = np.fft.fft2(image)
    
    # Shift the low frequency component to the center
    f = np.fft.fftshift(f)
    
    # Fourier phase and magnitude
    magnitude = np.abs(f)
    phase = np.angle(f)
    
    return magnitude, phase

@app.route('/upload_image_frequency', methods=['POST'])
def upload_image_frequency():
    data = request.json
    if 'image' not in data:
        return jsonify({'error': 'No image provided'}), 400

    # 解码Base64图像
    image_data = data['image']
    if ',' in image_data:
        image_data = image_data.split(',')[1]  # 删除前缀
    
    image_data = base64.b64decode(image_data)
    image = Image.open(io.BytesIO(image_data)).convert('L')  # 转换为灰度图像
    
    # 转换为NumPy数组
    gray_matrix = np.array(image)
    
    # 执行FFT
    magnitude, phase = fft(gray_matrix)
    
    # 保存频域数据为CSV文件
    csv_path = 'frequency_matrix.csv'
    np.savetxt(csv_path, magnitude.reshape(-1), delimiter=',', fmt='%f')

    return send_file(csv_path, as_attachment=True, download_name='frequency_matrix.csv')



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

