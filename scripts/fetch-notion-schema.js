#!/usr/bin/env node

import { Client } from '@notionhq/client'
import 'dotenv/config'

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

const DATABASE_ID = '13779839c200819db58bd3f239672f9a'

async function fetchDatabaseSchema() {
  try {
    console.log('🔍 Fetching Notion database schema...')
    console.log(`📋 Database ID: ${DATABASE_ID}`)
    console.log('')
    
    const response = await notion.databases.retrieve({
      database_id: DATABASE_ID,
    })

    console.log('📊 DATABASE INFORMATION:')
    console.log(`Title: ${response.title?.[0]?.plain_text || 'Untitled Database'}`)
    console.log(`Created: ${response.created_time}`)
    console.log(`Last edited: ${response.last_edited_time}`)
    console.log(`URL: ${response.url}`)
    console.log('')

    console.log('🏗️  DATABASE PROPERTIES:')
    console.log('='.repeat(50))
    
    const properties = response.properties
    const propertyNames = Object.keys(properties)
    
    console.log(`Total properties: ${propertyNames.length}`)
    console.log('')

    // Display each property with its details
    propertyNames.forEach((name, index) => {
      const property = properties[name]
      console.log(`${index + 1}. ${name}`)
      console.log(`   Type: ${property.type}`)
      
      // Add specific details based on property type
      switch (property.type) {
        case 'select':
          const selectOptions = property.select?.options || []
          console.log(`   Options: ${selectOptions.map(opt => opt.name).join(', ')}`)
          break
        case 'multi_select':
          const multiSelectOptions = property.multi_select?.options || []
          console.log(`   Options: ${multiSelectOptions.map(opt => opt.name).join(', ')}`)
          break
        case 'formula':
          console.log(`   Expression: ${property.formula?.expression || 'N/A'}`)
          break
        case 'rollup':
          console.log(`   Relation property: ${property.rollup?.relation_property_name || 'N/A'}`)
          console.log(`   Rollup property: ${property.rollup?.rollup_property_name || 'N/A'}`)
          console.log(`   Function: ${property.rollup?.function || 'N/A'}`)
          break
        case 'relation':
          console.log(`   Database ID: ${property.relation?.database_id || 'N/A'}`)
          break
        case 'number':
          console.log(`   Format: ${property.number?.format || 'number'}`)
          break
      }
      console.log('')
    })

    console.log('🎯 PROPERTY SUMMARY FOR SQL SCHEMA:')
    console.log('='.repeat(50))
    
    propertyNames.forEach(name => {
      const property = properties[name]
      let sqlType = 'TEXT'
      
      switch (property.type) {
        case 'number':
          sqlType = 'NUMERIC'
          break
        case 'checkbox':
          sqlType = 'BOOLEAN'
          break
        case 'date':
          sqlType = 'TIMESTAMP'
          break
        case 'select':
        case 'status':
          sqlType = 'TEXT'
          break
        case 'multi_select':
        case 'people':
        case 'files':
        case 'relation':
          sqlType = 'JSONB'
          break
        case 'title':
        case 'rich_text':
        case 'url':
        case 'email':
        case 'phone_number':
        default:
          sqlType = 'TEXT'
          break
      }
      
      console.log(`${name.toLowerCase().replace(/\s+/g, '_')} ${sqlType},  -- ${property.type}`)
    })

    return {
      title: response.title?.[0]?.plain_text || 'Untitled Database',
      properties: response.properties,
      created_time: response.created_time,
      last_edited_time: response.last_edited_time,
      url: response.url
    }

  } catch (error) {
    console.error('❌ Error fetching database schema:', error)
    if (error.code === 'object_not_found') {
      console.error('🔍 Database not found. Check that:')
      console.error('  1. The database ID is correct')
      console.error('  2. The integration has access to this database')
      console.error('  3. The database exists and is accessible')
    }
    throw error
  }
}

// Run the script
fetchDatabaseSchema()
  .then(() => {
    console.log('✅ Schema fetch completed!')
  })
  .catch(error => {
    console.error('💥 Script failed:', error.message)
    process.exit(1)
  })