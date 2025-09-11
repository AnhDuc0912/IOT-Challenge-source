import paho.mqtt.client as mqtt
import json
import time
import random
from datetime import datetime
            
# Hàm tạo dữ liệu giả
def create_data():
    return {
        "id": "48:b0:2d:3d:2b:28",
        "values": [200, 200,200,200,200,200,200,200,200,200,200,200,200,200,200]
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
        sensor_data = {
            "id": "48:b0:2d:3d:2b:28",
            "humidity": random.randint(30, 90),  # Example humidity value
            "temperature": random.randint(20, 30),  # Example temperature value
            "light": random.randint(100, 1000),  # Example light value
            "pressure": random.randint(950, 1050)  # Example pressure value
        }
        client.publish("shelf/sensor/environment", json.dumps(sensor_data))
        shelf_status = {
            "id": "48:b0:2d:3d:2b:28",
            "shelf_status_lean": True,
            "shelf_status_shake": True,
            "date_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        client.publish("shelf/status/data", json.dumps(shelf_status))
        print("Sent shelf status update")
        unpaid_customer = {
            "id": "48:b0:2d:3d:2b:28",
            "taken_quantity": [1,0,2,0,0,0,0,0,0,0,0,0,0,0,0],
            "date_time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
        client.publish("shelf/tracking/unpaid_customer", json.dumps(unpaid_customer))
        print("Sent unpaid customer warning")
        time.sleep(5)

except KeyboardInterrupt:
    print("Dừng gửi dữ liệu.")
    client.disconnect()
