import paho.mqtt.client as mqtt
import json
import time
import random

# Hàm tạo dữ liệu giả
def create_data():
    return {
        "id": "48:b0:2d:3d:2b:28",
        "values": [random.randint(0, 100) for _ in range(15)]
    }

# Tạo MQTT client sử dụng WebSocket
client = mqtt.Client(client_id="ducxautrai",transport="websockets")

# Kết nối tới broker HiveMQ WebSocket (cloud)
client.connect("broker.hivemq.com", 8000, 60)

# Vòng lặp gửi dữ liệu mỗi 5 giây
try:
    while True:
        payload = json.dumps(create_data())
        client.publish("shelf/loadcell/quantity", payload)
        print(f"Đã gửi: {payload}")
        time.sleep(5)

except KeyboardInterrupt:
    print("Dừng gửi dữ liệu.")
    client.disconnect()