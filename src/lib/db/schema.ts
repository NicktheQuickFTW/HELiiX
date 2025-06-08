import { pgTable, serial, text, timestamp, integer, boolean, pgEnum } from 'drizzle-orm/pg-core'

export const statusEnum = pgEnum('status', ['planned', 'ordered', 'approved', 'delivered', 'received'])

export const awards = pgTable('awards', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  status: statusEnum('status').notNull().default('planned'),
  quantity: integer('quantity').notNull().default(0),
  imageUrl: text('image_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const invoices = pgTable('invoices', {
  id: serial('id').primaryKey(),
  invoiceNumber: text('invoice_number').notNull().unique(),
  vendorName: text('vendor_name').notNull(),
  amount: integer('amount').notNull(), // stored in cents
  status: statusEnum('status').notNull().default('planned'),
  date: timestamp('date').notNull(),
  dueDate: timestamp('due_date'),
  imageUrl: text('image_url'),
  notes: text('notes'),
  awardId: integer('award_id').references(() => awards.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  fileName: text('file_name').notNull(),
  fileUrl: text('file_url').notNull(),
  fileType: text('file_type').notNull(),
  fileSize: integer('file_size').notNull(),
  entityType: text('entity_type').notNull(), // 'award' or 'invoice'
  entityId: integer('entity_id').notNull(),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
})

export type Award = typeof awards.$inferSelect
export type NewAward = typeof awards.$inferInsert
export type Invoice = typeof invoices.$inferSelect
export type NewInvoice = typeof invoices.$inferInsert
export type Document = typeof documents.$inferSelect
export type NewDocument = typeof documents.$inferInsert