import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { logActivity } from '@/lib/activity-log'
import { headers } from 'next/headers'
import { deleteClientAccount, getClientAccountById, updateClientAccount } from '@/lib/client-records'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin()
    const body = await request.json()
    const headerList = headers()
    const ip = headerList.get('x-forwarded-for') || 'unknown'

    const { name, email, password, companyName, companyNameAr, phone, address } = body

    const existingClient = await getClientAccountById(params.id)

    if (!existingClient) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    const duplicateUser = await prisma.user.findFirst({
      where: {
        email,
        id: {
          not: existingClient.userId,
        },
      },
    })

    if (duplicateUser) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
    }

    const userUpdateData: any = {
      name,
      email,
    }

    if (password) {
      userUpdateData.password = await bcrypt.hash(password, 12)
    }

    await prisma.user.update({
      where: { id: existingClient.userId },
      data: userUpdateData,
    })

    await updateClientAccount(params.id, {
      companyName,
      companyNameAr,
      phone,
      address,
    })

    await logActivity(
      session.user.id,
      'CLIENT_UPDATED',
      'client',
      params.id,
      `Updated client account for ${companyName}`,
      ip
    )

    const updatedClient = await getClientAccountById(params.id)
    return NextResponse.json(updatedClient)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === 'Forbidden' ? 403 : 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await requireAdmin()
    const headerList = headers()
    const ip = headerList.get('x-forwarded-for') || 'unknown'

    const client = await getClientAccountById(params.id)

    if (!client) {
      return NextResponse.json({ error: 'Client not found' }, { status: 404 })
    }

    await logActivity(
      session.user.id,
      'CLIENT_DELETED',
      'client',
      params.id,
      `Deleted client account for ${client.companyName}`,
      ip
    )

    await deleteClientAccount(params.id)
    await prisma.user.delete({
      where: { id: client.userId },
    }).catch(() => undefined)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: error.message === 'Forbidden' ? 403 : 500 })
  }
}
