// src/utils/api.ts

// ⚠️ GANTI IP INI SESUAI HASIL IPCONFIG DI LAPTOP ANDA
// Pastikan protocolnya http:// (bukan https) dan port :5000
const API_BASE_URL = "https://tonda-asynchronous-nonvocally.ngrok-free.dev"; 

console.log("🔗 Target API:", API_BASE_URL);

type PredictResponse = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  confidence: number;
  [key: string]: any;
};

export async function sendImage(imageUri: string): Promise<PredictResponse> {
  const formData = new FormData();

  formData.append("file", {
    uri: imageUri,
    name: "photo.jpg",
    type: "image/jpeg",
  } as any);

  try {
    const resp = await fetch(`${API_BASE_URL}/predict`, {
      method: "POST",
      body: formData,
      headers: {
        "Accept": "application/json",
      },
    });

    if (!resp.ok) {
      const text = await resp.text();
      console.error("❌ Server Error:", text);
      throw new Error(`API error ${resp.status}: ${text}`);
    }

    const data = await resp.json();
    return data as PredictResponse;

  } catch (error: any) {
    console.error("❌ GAGAL REQUEST (Network Failed):", error.message);
    console.error("   SOLUSI: 1. Cek IP Laptop, 2. Matikan Firewall, 3. Pastikan satu WiFi");
    throw error;
  }
}