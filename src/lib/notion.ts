import { Client } from '@notionhq/client'

// Initialize Notion client
export const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

// Types for Notion database entries
export interface NotionDatabaseEntry {
  id: string
  properties: Record<string, any>
  created_time: string
  last_edited_time: string
  url: string
}

export interface NotionQueryResult {
  results: NotionDatabaseEntry[]
  has_more: boolean
  next_cursor?: string
}

// Helper function to format Notion properties
export function formatNotionProperty(property: any): any {
  if (!property) return null

  switch (property.type) {
    case 'title':
      return property.title?.[0]?.plain_text || ''
    case 'rich_text':
      return property.rich_text?.[0]?.plain_text || ''
    case 'number':
      return property.number
    case 'select':
      return property.select?.name || null
    case 'multi_select':
      return property.multi_select?.map((item: any) => item.name) || []
    case 'date':
      return property.date?.start || null
    case 'checkbox':
      return property.checkbox
    case 'url':
      return property.url
    case 'email':
      return property.email
    case 'phone_number':
      return property.phone_number
    case 'status':
      return property.status?.name || null
    case 'people':
      return property.people?.map((person: any) => person.name) || []
    case 'files':
      return property.files?.map((file: any) => file.file?.url || file.external?.url) || []
    case 'relation':
      return property.relation?.map((rel: any) => rel.id) || []
    case 'formula':
      return formatNotionProperty(property.formula)
    case 'rollup':
      return property.rollup?.array?.map((item: any) => formatNotionProperty(item)) || []
    default:
      return property
  }
}

// Query database with filters and sorting
export async function queryDatabase(
  databaseId: string,
  options: {
    filter?: any
    sorts?: any[]
    page_size?: number
    start_cursor?: string
  } = {}
): Promise<NotionQueryResult> {
  try {
    const response = await notion.databases.query({
      database_id: databaseId,
      filter: options.filter,
      sorts: options.sorts,
      page_size: options.page_size || 100,
      start_cursor: options.start_cursor,
    })

    return {
      results: response.results.map(result => ({
        id: result.id,
        properties: result.properties,
        created_time: result.created_time,
        last_edited_time: result.last_edited_time,
        url: result.url || '',
      })),
      has_more: response.has_more,
      next_cursor: response.next_cursor || undefined,
    }
  } catch (error) {
    console.error('Error querying Notion database:', error)
    throw error
  }
}

// Get database schema
export async function getDatabaseSchema(databaseId: string) {
  try {
    const response = await notion.databases.retrieve({
      database_id: databaseId,
    })

    return {
      id: response.id,
      title: response.title?.[0]?.plain_text || 'Untitled Database',
      properties: response.properties,
      url: response.url,
      created_time: response.created_time,
      last_edited_time: response.last_edited_time,
    }
  } catch (error) {
    console.error('Error getting database schema:', error)
    throw error
  }
}

// Format database entries for display
export function formatDatabaseEntries(entries: NotionDatabaseEntry[]) {
  return entries.map(entry => {
    const formattedProperties: Record<string, any> = {}
    
    Object.entries(entry.properties).forEach(([key, property]) => {
      formattedProperties[key] = formatNotionProperty(property)
    })

    return {
      id: entry.id,
      properties: formattedProperties,
      created_time: entry.created_time,
      last_edited_time: entry.last_edited_time,
      url: entry.url,
    }
  })
}

// Constants for the database IDs and views
export const NOTION_CONFIG = {
  DATABASE_ID: process.env.NOTION_DATABASE_ID || '13779839c200819db58bd3f239672f9a',
  VIEW_ID: '13779839c2008192bcab000ca47c7543', // From the URL you shared
  EMBED_URL: `https://www.notion.so/embed/13779839c200819db58bd3f239672f9a?v=13779839c2008192bcab000ca47c7543`,
  PUBLIC_URL: `https://www.notion.so/13779839c200819db58bd3f239672f9a?v=13779839c2008192bcab000ca47c7543`,
}

// Default sorts and filters
export const DEFAULT_QUERY_OPTIONS = {
  sorts: [
    {
      property: 'created_time',
      direction: 'descending' as const,
    },
  ],
  page_size: 50,
}