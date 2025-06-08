import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { awards } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function GET() {
  try {
    const allAwards = await db.select().from(awards)
    return NextResponse.json(allAwards)
  } catch (error) {
    console.error('Error fetching awards:', error)
    return NextResponse.json({ error: 'Failed to fetch awards' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const newAward = await db.insert(awards).values(body).returning()
    return NextResponse.json(newAward[0])
  } catch (error) {
    console.error('Error creating award:', error)
    return NextResponse.json({ error: 'Failed to create award' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updateData } = body
    const updated = await db
      .update(awards)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(awards.id, id))
      .returning()
    return NextResponse.json(updated[0])
  } catch (error) {
    console.error('Error updating award:', error)
    return NextResponse.json({ error: 'Failed to update award' }, { status: 500 })
  }
}