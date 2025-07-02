import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendWelcomeEmail } from '@/lib/email'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.redirect(new URL('/auth/error?error=MissingToken', req.url))
  }

  try {
    // Verificar el token de verificación
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token }
    })

    if (!verificationToken) {
      return NextResponse.redirect(new URL('/auth/error?error=InvalidToken', req.url))
    }

    // Verificar si el token ha expirado
    if (verificationToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: { token }
      })
      return NextResponse.redirect(new URL('/auth/error?error=ExpiredToken', req.url))
    }

    // Buscar usuario por email
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier }
    })

    if (!user) {
      return NextResponse.redirect(new URL('/auth/error?error=UserNotFound', req.url))
    }

    // Marcar email como verificado
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: new Date() }
    })

    // Eliminar token de verificación usado
    await prisma.verificationToken.delete({
      where: { token }
    })

    // Enviar email de bienvenida
    if (user.name) {
      await sendWelcomeEmail(user.email, user.name)
    }

    // Redirigir a página de éxito
    return NextResponse.redirect(new URL('/auth/verified', req.url))

  } catch (error) {
    console.error('Error verificando email:', error)
    return NextResponse.redirect(new URL('/auth/error?error=VerificationFailed', req.url))
  }
}
