// Netlify Function para manejar las APIs del bot
// Este archivo puede ser útil si necesitas serverless functions

exports.handler = async (event, context) => {
  const { path, httpMethod, headers, body } = event;

  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  // Handle preflight OPTIONS request
  if (httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  try {
    // Aquí puedes agregar la lógica de tu API
    // Por ejemplo, proxy a tu bot de Telegram o APIs de vuelos
    
    return {
      statusCode: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'Netlify Function funcionando correctamente',
        path,
        method: httpMethod,
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        error: 'Error interno del servidor',
        message: error.message,
      }),
    };
  }
};
