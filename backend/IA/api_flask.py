from flask import Flask, request, jsonify
from keras.models import load_model
from keras.utils import load_img, img_to_array
from keras.layers import LeakyReLU
import numpy as np
from PIL import Image
import io

app = Flask(__name__)

MODEL_PATH = 'modelo_cnn_finetuned.keras'
model = load_model(MODEL_PATH, custom_objects={"LeakyReLU": LeakyReLU})
IMG_SIZE = (224, 224)  

# @app.route('/', methods=['GET'])
# def home():
#     return jsonify({"message": "API de predição de saúde da imagem. Use o endpoint /predict para enviar uma imagem."})

@app.route('/', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'Nenhum arquivo enviado.'}), 400
    file = request.files['file']
    image = Image.open(file.stream).convert("RGB")
    image = image.resize(IMG_SIZE)
    img_array = img_to_array(image)
    img_array = np.expand_dims(img_array, axis=0) / 255.0
    prediction = model.predict(img_array)
    prob = float(prediction[0][0])
    if prob >= 0.5:
        result = 'saudavel'
    else:
        result = 'doente'
    confidence = prob if result == 'saudavel' else 1 - prob
    return jsonify({'class': result, 'confidence': confidence})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
