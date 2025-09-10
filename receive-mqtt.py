import paho.mqtt.client as mqtt
import json

# Hàm khi kết nối thành công
def on_connect(client, userdata, flags, rc):
    print("✅ Đã kết nối với mã:", rc)
    # Subscribe các topic
    client.subscribe("shelf/sensor/environment")
    client.subscribe("shelf/status/data")
    client.subscribe("shelf/tracking/unpaid_customer")
    client.subscribe("shelf/loadcell/quantity")
    print("📡 Đã đăng ký các topic")

# Hàm khi nhận được tin nhắn
def on_message(client, userdata, msg):
    try:
        payload = json.loads(msg.payload.decode())
        print(f"\n📩 Nhận từ topic: {msg.topic}")

        if msg.topic == "shelf/sensor/environment":
            print("ID:", payload.get("id"))
            print("humidity:", payload.get("humidity"))
            print("temperature:", payload.get("temperature"))
            print("light:", payload.get("light"))
            print("pressure:", payload.get("pressure"))

        elif msg.topic == "shelf/status/data":
            print("ID:", payload.get("id"))
            print("shelf_status_lean:", payload.get("shelf_status_lean"))
            print("shelf_status_shake:", payload.get("shelf_status_shake"))
            print("date_time:", payload.get("date_time"))

        elif msg.topic == "shelf/tracking/unpaid_customer":
            print("ID:", payload.get("id"))
            print("taken_quantity:", payload.get("taken_quantity"))
            print("date_time:", payload.get("date_time"))

        elif msg.topic == "shelf/loadcell/quantity":
            print("ID:", payload.get("id"))
            print("quantity:", payload.get("values"))

    except Exception as e:
        print("❌ Lỗi giải mã JSON:", e)

# Tạo client MQTT dùng WebSocket
client = mqtt.Client(transport="websockets")
client.on_connect = on_connect
client.on_message = on_message

# Kết nối tới HiveMQ broker qua WebSocket
client.connect("broker.hivemq.com", 8000, 60)

# Vòng lặp lắng nghe tin nhắn
client.loop_forever()