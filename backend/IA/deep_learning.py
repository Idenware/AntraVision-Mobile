import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau, ModelCheckpoint
import matplotlib.pyplot as plt
from tensorflow.keras.preprocessing import image
import numpy as np
import os

# Caminho para o dataset
base_dir = 'dataset2/'

# Aumento de dados
train_datagen = ImageDataGenerator(
    rescale=1./255,
    rotation_range=20,
    zoom_range=0.2,
    horizontal_flip=True,
    shear_range=0.2,
    width_shift_range=0.1,
    height_shift_range=0.1
)

val_datagen = ImageDataGenerator(rescale=1./255)
test_datagen = ImageDataGenerator(rescale=1./255)

# Carregando dados
train_generator = train_datagen.flow_from_directory(
    base_dir + 'train/',
    target_size=(224, 224),
    batch_size=24,
    class_mode='binary'
)

val_generator = val_datagen.flow_from_directory(
    base_dir + 'validation/',
    target_size=(224, 224),
    batch_size=24,
    class_mode='binary'
)

print("Classes mapeadas:", train_generator.class_indices)

# Hiperparâmetros
learning_rate = 0.0001
batch_size = 24
epochs = 30

# Arquitetura personalizada
base_model = tf.keras.applications.MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights='imagenet'
)
base_model.trainable = False

model = tf.keras.Sequential([
    base_model,
    GlobalAveragePooling2D(),
    Dense(128, activation=tf.keras.layers.LeakyReLU()),
    Dropout(0.5),
    Dense(1, activation='sigmoid')
])

model.compile(optimizer=Adam(learning_rate=learning_rate), loss='binary_crossentropy', metrics=['accuracy'])

# Callbacks
early_stop = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
reduce_lr = ReduceLROnPlateau(monitor='val_loss', patience=3, factor=0.5, verbose=1)
checkpoint = ModelCheckpoint('modelo_cnn.keras', monitor='val_loss', save_best_only=True, verbose=1)

# Treinamento
history = model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=epochs,
    callbacks=[early_stop, reduce_lr, checkpoint]
)

# Salvar modelo final
model.save('modelo_cnn_personalizado.keras')

# Descongelar as camadas do modelo base para fine-tuning
base_model.trainable = True

# Recompilar o modelo com uma taxa de aprendizado menor para o fine-tuning
model.compile(optimizer=Adam(learning_rate=learning_rate * 0.1), loss='binary_crossentropy', metrics=['accuracy'])

# Treinamento adicional com fine-tuning
history_fine_tuning = model.fit(
    train_generator,
    validation_data=val_generator,
    epochs=10,  # Número de épocas adicionais para o fine-tuning
    callbacks=[early_stop, reduce_lr, checkpoint]
)

# Salvar o modelo ajustado
model.save('modelo_cnn_finetuned.keras')

# Visualização de resultados
plt.figure(figsize=(12, 4))

# Gráfico de perda
plt.subplot(1, 2, 1)
plt.plot(history.history['loss'], label='Treinamento')
plt.plot(history.history['val_loss'], label='Validação')
plt.title('Perda')
plt.xlabel('Épocas')
plt.ylabel('Perda')
plt.legend()

# Gráfico de acurácia
plt.subplot(1, 2, 2)
plt.plot(history.history['accuracy'], label='Treinamento')
plt.plot(history.history['val_accuracy'], label='Validação')
plt.title('Acurácia')
plt.xlabel('Épocas')
plt.ylabel('Acurácia')
plt.legend()

plt.tight_layout()
plt.show()
