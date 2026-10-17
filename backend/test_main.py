import pytest
from fastapi.testclient import TestClient
from main import app
from database import Base, engine

client = TestClient(app)

@pytest.fixture(autouse=True)
def setup_database():
    Base.metadata.create_all(bind=engine)
    yield
    Base.metadata.drop_all(bind=engine)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "inference_mode" in data


def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_create_conversation():
    response = client.post("/api/conversations", json={"title": "Test Chat"})
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Chat"
    assert "id" in data

def test_send_message():
    # Create conversation
    conv_resp = client.post("/api/conversations", json={"title": "Test"})
    conv_id = conv_resp.json()["id"]
    
    # Send message
    response = client.post(
        f"/api/conversations/{conv_id}/messages",
        json={"content": "Hello"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["role"] == "assistant"
    assert "[DEMO MODE]" in data["content"]

def test_create_memory():
    response = client.post(
        "/api/memories",
        json={"content": "User prefers dark mode", "category": "preference"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["content"] == "User prefers dark mode"
    assert data["enabled"] is True

def test_list_memories():
    # Create memory
    client.post("/api/memories", json={"content": "Test memory"})
    
    # List
    response = client.get("/api/memories")
    assert response.status_code == 200
    data = response.json()
    assert len(data) >= 1

def test_delete_memory():
    # Create
    create_resp = client.post("/api/memories", json={"content": "Delete me"})
    mem_id = create_resp.json()["id"]
    
    # Delete
    response = client.delete(f"/api/memories/{mem_id}")
    assert response.status_code == 200
    
    # Verify deleted
    get_resp = client.get(f"/api/memories/{mem_id}")
    assert get_resp.status_code == 404
