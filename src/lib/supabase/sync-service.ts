import { createClient } from '@supabase/supabase-js'
import { notion, NOTION_CONFIG } from '@/lib/notion'
import type { Client } from '@notionhq/client'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

interface NotionContact {
  id: string
  properties: Record<string, any>
  created_time: string
  last_edited_time: string
  url: string
}

interface SupabaseContact {
  id?: string
  notion_id: string
  name?: string
  first_name?: string
  last_name?: string
  title?: string
  position?: string
  role?: string
  email?: string
  phone?: string
  mobile?: string
  website?: string
  organization?: string
  school?: string
  institution?: string
  department?: string
  sport?: string
  sports?: string[]
  sport_responsibility?: string
  program?: string
  location?: string
  city?: string
  state?: string
  address?: string
  notion_created_time?: string
  notion_last_edited_time?: string
  notion_url?: string
  sync_status?: string
  sync_error?: string
  additional_properties?: Record<string, any>
}

interface SyncResult {
  success: boolean
  recordsProcessed: number
  recordsCreated: number
  recordsUpdated: number
  recordsDeleted: number
  errors: string[]
  syncLogId?: string
}

export class NotionSupabaseSync {
  private notion: Client
  private supabase: any

  constructor() {
    this.notion = notion
    this.supabase = supabase
  }

  /**
   * Transform Notion properties to Supabase contact format
   */
  private transformNotionContact(notionContact: NotionContact): SupabaseContact {
    const props = notionContact.properties
    const contact: SupabaseContact = {
      notion_id: notionContact.id,
      notion_created_time: notionContact.created_time,
      notion_last_edited_time: notionContact.last_edited_time,
      notion_url: notionContact.url,
      sync_status: 'synced',
      additional_properties: {}
    }

    // Map actual Notion property fields to Supabase columns
    const propertyMappings = {
      // Core Contact Information
      'Name': 'name',
      'First Name': 'first_name',
      'Last Name': 'last_name',
      'E-Mail': 'email',
      'Phone': 'phone',
      'Birthdate': 'birthdate',
      
      // Organizational Information
      'Affiliation': 'affiliation',
      'Title': 'title',
      'Department [Conf. Office]': 'department_conf_office',
      'Member Status': 'member_status'
    }

    // Multi-select fields that should be stored as JSONB arrays
    const multiSelectMappings = {
      'Sport': 'sport',
      'Sport Role': 'sport_role',
      'Governance Group': 'governance_group',
      'Sport Liaison For': 'sport_liaison_for',
      'Secondary Liaison For': 'secondary_liaison_for',
      'Communications Liaison For': 'communications_liaison_for',
      'Marketing Liaison For': 'marketing_liaison_for',
      'SWA Liaison For': 'swa_liaison_for',
      'Secondary SWA Liaison For': 'secondary_swa_liaison_for',
      'Liaison to Officials For': 'liaison_to_officials_for'
    }

    // Process each property
    Object.entries(props).forEach(([key, value]) => {
      if (!value) return

      // Extract the actual value based on Notion property type
      let extractedValue: any = null
      
      if (value.type === 'title' && value.title?.length > 0) {
        extractedValue = value.title.map((t: any) => t.plain_text).join('')
      } else if (value.type === 'rich_text' && value.rich_text?.length > 0) {
        extractedValue = value.rich_text.map((t: any) => t.plain_text).join('')
      } else if (value.type === 'email' && value.email) {
        extractedValue = value.email
      } else if (value.type === 'phone_number' && value.phone_number) {
        extractedValue = value.phone_number
      } else if (value.type === 'url' && value.url) {
        extractedValue = value.url
      } else if (value.type === 'select' && value.select?.name) {
        extractedValue = value.select.name
      } else if (value.type === 'multi_select' && value.multi_select?.length > 0) {
        extractedValue = value.multi_select.map((s: any) => s.name)
      } else if (value.type === 'people' && value.people?.length > 0) {
        extractedValue = value.people.map((p: any) => p.name || p.id).join(', ')
      } else if (value.type === 'relation' && value.relation?.length > 0) {
        extractedValue = value.relation.map((r: any) => r.id).join(', ')
      } else if (value.type === 'date' && value.date?.start) {
        extractedValue = value.date.start
      } else if (value.type === 'checkbox') {
        extractedValue = value.checkbox
      } else if (value.type === 'number' && value.number !== null) {
        extractedValue = value.number
      }

      if (extractedValue !== null) {
        // Check if this is a multi-select field that should be stored as JSONB
        const multiSelectColumn = multiSelectMappings[key as keyof typeof multiSelectMappings]
        if (multiSelectColumn) {
          // Store multi-select as JSONB array
          (contact as any)[multiSelectColumn] = Array.isArray(extractedValue) ? extractedValue : [extractedValue]
        } else {
          // Check if this property maps to a regular column
          const mappedColumn = propertyMappings[key as keyof typeof propertyMappings]
          if (mappedColumn) {
            // Handle date fields specially
            if (mappedColumn === 'birthdate' && extractedValue) {
              (contact as any)[mappedColumn] = extractedValue
            } else {
              (contact as any)[mappedColumn] = Array.isArray(extractedValue) ? extractedValue.join(', ') : extractedValue
            }
          } else {
            // Store unmapped properties in additional_properties JSON field
            contact.additional_properties![key] = extractedValue
          }
        }
      }
    })

    return contact
  }

  /**
   * Start a sync operation and log it
   */
  private async startSyncLog(syncType: 'full' | 'incremental' | 'manual'): Promise<string> {
    const { data, error } = await this.supabase
      .from('notion_sync_log')
      .insert({
        sync_type: syncType,
        status: 'running',
        started_at: new Date().toISOString()
      })
      .select('id')
      .single()

    if (error) {
      throw new Error(`Failed to start sync log: ${error.message}`)
    }

    return data.id
  }

  /**
   * Complete a sync operation log
   */
  private async completeSyncLog(
    syncLogId: string, 
    result: Omit<SyncResult, 'syncLogId'>,
    syncDetails?: Record<string, any>
  ): Promise<void> {
    const { error } = await this.supabase
      .from('notion_sync_log')
      .update({
        status: result.success ? 'completed' : 'failed',
        completed_at: new Date().toISOString(),
        records_processed: result.recordsProcessed,
        records_created: result.recordsCreated,
        records_updated: result.recordsUpdated,
        records_deleted: result.recordsDeleted,
        error_message: result.errors.length > 0 ? result.errors.join('; ') : null,
        sync_details: syncDetails || {}
      })
      .eq('id', syncLogId)

    if (error) {
      console.error('Failed to update sync log:', error)
    }
  }

  /**
   * Fetch all contacts from Notion database
   */
  private async fetchNotionContacts(): Promise<NotionContact[]> {
    const contacts: NotionContact[] = []
    let hasMore = true
    let startCursor: string | undefined

    while (hasMore) {
      try {
        const response = await this.notion.databases.query({
          database_id: NOTION_CONFIG.DATABASE_ID,
          start_cursor: startCursor,
          page_size: 100
        })

        contacts.push(...response.results as NotionContact[])
        hasMore = response.has_more
        startCursor = response.next_cursor || undefined
      } catch (error) {
        throw new Error(`Failed to fetch Notion contacts: ${error}`)
      }
    }

    return contacts
  }

  /**
   * Sync all contacts from Notion to Supabase
   */
  async syncAll(): Promise<SyncResult> {
    const syncLogId = await this.startSyncLog('full')
    const result: SyncResult = {
      success: true,
      recordsProcessed: 0,
      recordsCreated: 0,
      recordsUpdated: 0,
      recordsDeleted: 0,
      errors: [],
      syncLogId
    }

    try {
      console.log('Starting full sync from Notion to Supabase...')
      
      // Fetch all contacts from Notion
      const notionContacts = await this.fetchNotionContacts()
      result.recordsProcessed = notionContacts.length
      
      console.log(`Fetched ${notionContacts.length} contacts from Notion`)

      // Get existing contacts from Supabase
      const { data: existingContacts, error: fetchError } = await this.supabase
        .from('big12_contacts')
        .select('notion_id, notion_last_edited_time')

      if (fetchError) {
        throw new Error(`Failed to fetch existing contacts: ${fetchError.message}`)
      }

      const existingContactsMap = new Map(
        existingContacts?.map((c: any) => [c.notion_id, c.notion_last_edited_time]) || []
      )

      // Process each Notion contact
      for (const notionContact of notionContacts) {
        try {
          const transformedContact = this.transformNotionContact(notionContact)
          const existingLastEdited = existingContactsMap.get(notionContact.id)

          if (!existingLastEdited) {
            // Create new contact
            const { error: insertError } = await this.supabase
              .from('big12_contacts')
              .insert(transformedContact)

            if (insertError) {
              result.errors.push(`Failed to create contact ${notionContact.id}: ${insertError.message}`)
            } else {
              result.recordsCreated++
            }
          } else if (new Date(notionContact.last_edited_time) > new Date(existingLastEdited)) {
            // Update existing contact
            const { error: updateError } = await this.supabase
              .from('big12_contacts')
              .update(transformedContact)
              .eq('notion_id', notionContact.id)

            if (updateError) {
              result.errors.push(`Failed to update contact ${notionContact.id}: ${updateError.message}`)
            } else {
              result.recordsUpdated++
            }
          }
        } catch (error) {
          result.errors.push(`Error processing contact ${notionContact.id}: ${error}`)
        }
      }

      // Find and mark deleted contacts
      const notionContactIds = new Set(notionContacts.map(c => c.id))
      const contactsToDelete = existingContacts?.filter(
        (c: any) => !notionContactIds.has(c.notion_id)
      ) || []

      if (contactsToDelete.length > 0) {
        const { error: deleteError } = await this.supabase
          .from('big12_contacts')
          .update({ sync_status: 'deleted' })
          .in('notion_id', contactsToDelete.map((c: any) => c.notion_id))

        if (deleteError) {
          result.errors.push(`Failed to mark deleted contacts: ${deleteError.message}`)
        } else {
          result.recordsDeleted = contactsToDelete.length
        }
      }

      result.success = result.errors.length === 0
      console.log(`Sync completed: ${result.recordsCreated} created, ${result.recordsUpdated} updated, ${result.recordsDeleted} deleted`)

    } catch (error) {
      result.success = false
      result.errors.push(`Sync failed: ${error}`)
      console.error('Sync failed:', error)
    }

    await this.completeSyncLog(syncLogId, result, {
      notion_database_id: NOTION_CONFIG.DATABASE_ID,
      sync_timestamp: new Date().toISOString()
    })

    return result
  }

  /**
   * Sync only recently modified contacts
   */
  async syncIncremental(since?: Date): Promise<SyncResult> {
    const syncLogId = await this.startSyncLog('incremental')
    const sinceDate = since || new Date(Date.now() - 24 * 60 * 60 * 1000) // Default: last 24 hours
    
    const result: SyncResult = {
      success: true,
      recordsProcessed: 0,
      recordsCreated: 0,
      recordsUpdated: 0,
      recordsDeleted: 0,
      errors: [],
      syncLogId
    }

    try {
      console.log(`Starting incremental sync since ${sinceDate.toISOString()}`)

      // Query Notion for recently modified contacts
      const response = await this.notion.databases.query({
        database_id: NOTION_CONFIG.DATABASE_ID,
        filter: {
          timestamp: 'last_edited_time',
          last_edited_time: {
            after: sinceDate.toISOString()
          }
        },
        page_size: 100
      })

      const recentContacts = response.results as NotionContact[]
      result.recordsProcessed = recentContacts.length

      console.log(`Found ${recentContacts.length} recently modified contacts`)

      // Process each recent contact
      for (const notionContact of recentContacts) {
        try {
          const transformedContact = this.transformNotionContact(notionContact)

          // Check if contact exists
          const { data: existingContact, error: fetchError } = await this.supabase
            .from('big12_contacts')
            .select('id')
            .eq('notion_id', notionContact.id)
            .single()

          if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = no rows returned
            result.errors.push(`Failed to check existing contact ${notionContact.id}: ${fetchError.message}`)
            continue
          }

          if (existingContact) {
            // Update existing
            const { error: updateError } = await this.supabase
              .from('big12_contacts')
              .update(transformedContact)
              .eq('notion_id', notionContact.id)

            if (updateError) {
              result.errors.push(`Failed to update contact ${notionContact.id}: ${updateError.message}`)
            } else {
              result.recordsUpdated++
            }
          } else {
            // Create new
            const { error: insertError } = await this.supabase
              .from('big12_contacts')
              .insert(transformedContact)

            if (insertError) {
              result.errors.push(`Failed to create contact ${notionContact.id}: ${insertError.message}`)
            } else {
              result.recordsCreated++
            }
          }
        } catch (error) {
          result.errors.push(`Error processing contact ${notionContact.id}: ${error}`)
        }
      }

      result.success = result.errors.length === 0
      console.log(`Incremental sync completed: ${result.recordsCreated} created, ${result.recordsUpdated} updated`)

    } catch (error) {
      result.success = false
      result.errors.push(`Incremental sync failed: ${error}`)
      console.error('Incremental sync failed:', error)
    }

    await this.completeSyncLog(syncLogId, result, {
      since_date: sinceDate.toISOString(),
      notion_database_id: NOTION_CONFIG.DATABASE_ID
    })

    return result
  }

  /**
   * Get sync status and recent logs
   */
  async getSyncStatus() {
    const { data: recentLogs, error } = await this.supabase
      .from('notion_sync_log')
      .select('*')
      .order('started_at', { ascending: false })
      .limit(10)

    if (error) {
      throw new Error(`Failed to fetch sync logs: ${error.message}`)
    }

    const { data: contactStats, error: statsError } = await this.supabase
      .from('big12_contacts')
      .select('sync_status')

    if (statsError) {
      throw new Error(`Failed to fetch contact stats: ${statsError.message}`)
    }

    const stats = contactStats?.reduce((acc: any, contact: any) => {
      acc[contact.sync_status] = (acc[contact.sync_status] || 0) + 1
      return acc
    }, {})

    return {
      recentLogs,
      contactStats: stats,
      lastSync: recentLogs?.[0]?.completed_at || null
    }
  }
}

export const notionSupabaseSync = new NotionSupabaseSync()