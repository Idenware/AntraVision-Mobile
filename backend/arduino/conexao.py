import asyncio
import websockets
import serial

PORTA_SERIAL = 'COM3'  
BAUD_RATE = 9600

ultima_leitura = None

async def enviar_dados(websocket, path=None):  
    global ultima_leitura  
    try:
        print(f"Tentando conectar à porta serial {PORTA_SERIAL}...")
        ser = serial.Serial(PORTA_SERIAL, BAUD_RATE, timeout=1) 

        print(f"Conectado à porta serial {PORTA_SERIAL}. Aguardando dados do Arduino...")

        while True:
            if ser.in_waiting > 0:
                nova_leitura = ser.readline().decode('utf-8').strip()
                if nova_leitura and nova_leitura != ultima_leitura:  
                    ultima_leitura = nova_leitura 
                    print(f"Leitura da umidade: {ultima_leitura}")

                    await websocket.send(ultima_leitura)
                else:
                    print("Leitura repetida ou vazia recebida.")
            else:
                await asyncio.sleep(0.1)  

    except serial.SerialException as e:
        print(f"Erro na comunicação serial: {e}")
    except Exception as e:
        print(f"Erro: {e}")
    finally:
        if ser.is_open:
            print(f"Fechando a porta serial {PORTA_SERIAL}...")
            ser.close()

async def main():
    try:
        print("Iniciando servidor WebSocket...")
        async with websockets.serve(enviar_dados, "localhost", 5000):
            print("Servidor WebSocket iniciado na porta 5000.")
            await asyncio.Future() 
    except Exception as e:
        print(f"Erro ao iniciar o servidor WebSocket: {e}")

asyncio.run(main())
