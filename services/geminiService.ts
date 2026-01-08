
import { GoogleGenAI, Type } from "@google/genai";
import { Session } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getInsights = async (sessions: Session[]) => {
  try {
    const prompt = `Analiza los siguientes datos de transporte de la cooperativa COOMOQUIN en Quindío.
    Sesiones activas/cerradas: ${JSON.stringify(sessions)}
    
    Genera un informe ejecutivo breve para el administrador que incluya:
    1. Resumen de recaudo total.
    2. Identificación de rutas con mayor ocupación.
    3. Recomendaciones para optimizar el despacho.
    4. Alerta sobre posibles anomalías en el conteo de pasajeros.
    
    Responde en formato Markdown limpio.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Gemini Insight Error:", error);
    return "Error al generar insights. Por favor verifique la conexión.";
  }
};
