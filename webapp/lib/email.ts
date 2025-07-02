import nodemailer from 'nodemailer'

// Configurar transporter de email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true para 465, false para otros puertos
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=${token}`
  
  const mailOptions = {
    from: `"Flight-Bot" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: '✈️ Confirma tu cuenta en Flight-Bot',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✈️ Flight-Bot</h1>
              <p>Bienvenido a tu plataforma de alertas de vuelos</p>
            </div>
            <div class="content">
              <h2>¡Confirma tu cuenta!</h2>
              <p>Hola,</p>
              <p>Gracias por registrarte en Flight-Bot. Para completar tu registro y comenzar a recibir alertas de vuelos, necesitamos verificar tu dirección de email.</p>
              
              <p style="text-align: center;">
                <a href="${verificationUrl}" class="button">Confirmar Email</a>
              </p>
              
              <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
              <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
              
              <p><strong>¿Qué puedes hacer después de confirmar?</strong></p>
              <ul>
                <li>📱 Vincular tu cuenta con Telegram</li>
                <li>🔔 Crear alertas de precios de vuelos</li>
                <li>💰 Recibir notificaciones de ofertas</li>
                <li>🌍 Monitorear rutas internacionales</li>
              </ul>
              
              <p>Si no creaste esta cuenta, puedes ignorar este email.</p>
            </div>
            <div class="footer">
              <p>Flight-Bot - Tu asistente inteligente de viajes</p>
              <p>Este enlace expira en 24 horas</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Email de verificación enviado a:', email)
    return { success: true }
  } catch (error) {
    console.error('Error enviando email de verificación:', error)
    return { success: false, error }
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  const mailOptions = {
    from: `"Flight-Bot" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: '🎉 ¡Bienvenido a Flight-Bot!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 10px 5px; }
            .step { background: white; padding: 20px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #667eea; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 ¡Bienvenido a Flight-Bot!</h1>
              <p>Tu cuenta ha sido confirmada exitosamente</p>
            </div>
            <div class="content">
              <h2>¡Hola ${name}!</h2>
              <p>Tu cuenta en Flight-Bot está lista. Ahora puedes aprovechar todas nuestras funciones para encontrar los mejores precios de vuelos.</p>
              
              <h3>Próximos pasos:</h3>
              
              <div class="step">
                <h4>1. 📱 Conecta con Telegram</h4>
                <p>Vincula tu cuenta con nuestro bot para recibir alertas instantáneas</p>
                <a href="${process.env.NEXTAUTH_URL}/profile" class="button">Vincular Telegram</a>
              </div>
              
              <div class="step">
                <h4>2. 🔔 Crea tu primera alerta</h4>
                <p>Configura alertas para tus destinos favoritos</p>
                <a href="${process.env.NEXTAUTH_URL}/alerts/new" class="button">Crear Alerta</a>
              </div>
              
              <div class="step">
                <h4>3. 📊 Explora el Dashboard</h4>
                <p>Gestiona todas tus alertas desde un solo lugar</p>
                <a href="${process.env.NEXTAUTH_URL}/dashboard" class="button">Ver Dashboard</a>
              </div>
              
              <p><strong>¿Necesitas ayuda?</strong></p>
              <p>Contáctanos si tienes alguna pregunta. ¡Estamos aquí para ayudarte a encontrar los mejores vuelos!</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Email de bienvenida enviado a:', email)
    return { success: true }
  } catch (error) {
    console.error('Error enviando email de bienvenida:', error)
    return { success: false, error }
  }
}

export async function sendInvitationEmail(email: string, invitedBy: string) {
  const signupUrl = `${process.env.NEXTAUTH_URL}/auth/signin?invited=true`
  
  const mailOptions = {
    from: `"Flight-Bot" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to: email,
    subject: '✈️ Te han invitado a Flight-Bot',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✈️ Flight-Bot</h1>
              <p>Has sido invitado a unirte</p>
            </div>
            <div class="content">
              <h2>🎉 ¡Te han invitado!</h2>
              <p><strong>${invitedBy}</strong> te ha invitado a unirte a Flight-Bot, la plataforma inteligente para encontrar los mejores precios de vuelos.</p>
              
              <p><strong>¿Qué es Flight-Bot?</strong></p>
              <ul>
                <li>🔔 Alertas automáticas de precios de vuelos</li>
                <li>📱 Notificaciones instantáneas por Telegram</li>
                <li>🌍 Monitoreo de rutas internacionales</li>
                <li>💰 Encuentra las mejores ofertas</li>
              </ul>
              
              <p style="text-align: center;">
                <a href="${signupUrl}" class="button">Unirme Ahora</a>
              </p>
              
              <p>El registro es completamente gratuito y puedes comenzar a usar todas las funciones inmediatamente.</p>
              
              <p style="color: #666; font-size: 14px;">Si no estás interesado, simplemente ignora este email.</p>
            </div>
          </div>
        </body>
      </html>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log('Email de invitación enviado a:', email)
    return { success: true }
  } catch (error) {
    console.error('Error enviando email de invitación:', error)
    return { success: false, error }
  }
}
