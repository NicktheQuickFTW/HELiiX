import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

class AwardsInvoiceTracker {
  constructor() {
    this.totalRecords = 56; // As you mentioned
  }

  async getAllInvoices() {
    console.log('📋 Fetching all 56 invoice records...\n');

    try {
      const {
        data: invoices,
        error,
        count,
      } = await supabase
        .from('invoices')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching invoices:', error);
        return null;
      }

      console.log(
        `✅ Successfully retrieved ${count || invoices?.length || 0} invoices`
      );
      return invoices;
    } catch (error) {
      console.error('❌ Error:', error.message);
      return null;
    }
  }

  async generateYearlyReport() {
    console.log('🏆 BIG 12 AWARDS INVOICE TRACKING REPORT - 2024-25\n');
    console.log('='.repeat(60));

    const invoices = await this.getAllInvoices();
    if (!invoices) return;

    // Calculate totals
    const stats = {
      totalInvoices: invoices.length,
      totalAmount: 0,
      totalTax: 0,
      totalShipping: 0,
      byStatus: {},
      byVendor: {},
      bySport: {},
      byClassCode: {},
      upcoming: [],
      overdue: [],
    };

    const today = new Date();

    invoices.forEach((invoice) => {
      // Financial totals
      stats.totalAmount += invoice.total_amount || 0;
      stats.totalTax += invoice.tax_amount || 0;
      stats.totalShipping += invoice.shipping_cost || 0;

      // Group by status
      const status = invoice.status || 'unknown';
      stats.byStatus[status] = (stats.byStatus[status] || 0) + 1;

      // Group by vendor
      const vendor = invoice.vendor_name || 'Unknown';
      if (!stats.byVendor[vendor]) {
        stats.byVendor[vendor] = { count: 0, amount: 0 };
      }
      stats.byVendor[vendor].count++;
      stats.byVendor[vendor].amount += invoice.total_amount || 0;

      // Group by class code (Big 12 accounting)
      if (invoice.class_code) {
        const classCode = invoice.class_code;
        if (!stats.byClassCode[classCode]) {
          stats.byClassCode[classCode] = { count: 0, amount: 0 };
        }
        stats.byClassCode[classCode].count++;
        stats.byClassCode[classCode].amount += invoice.total_amount || 0;
      }

      // Check due dates
      if (invoice.due_date) {
        const dueDate = new Date(invoice.due_date);
        const daysUntilDue = Math.ceil(
          (dueDate - today) / (1000 * 60 * 60 * 24)
        );

        if (daysUntilDue < 0 && invoice.status !== 'paid') {
          stats.overdue.push({
            invoice_number: invoice.invoice_number,
            vendor: invoice.vendor_name,
            amount: invoice.total_amount,
            daysOverdue: Math.abs(daysUntilDue),
          });
        } else if (daysUntilDue <= 30 && invoice.status !== 'paid') {
          stats.upcoming.push({
            invoice_number: invoice.invoice_number,
            vendor: invoice.vendor_name,
            amount: invoice.total_amount,
            daysUntilDue: daysUntilDue,
          });
        }
      }
    });

    // Display report
    console.log('📊 FINANCIAL SUMMARY:');
    console.log(`   Total Invoices: ${stats.totalInvoices}`);
    console.log(
      `   Total Amount: $${(stats.totalAmount / 100).toLocaleString()}`
    );
    console.log(`   Total Tax: $${(stats.totalTax / 100).toLocaleString()}`);
    console.log(
      `   Total Shipping: $${(stats.totalShipping / 100).toLocaleString()}`
    );
    console.log(
      `   Grand Total: $${((stats.totalAmount + stats.totalTax + stats.totalShipping) / 100).toLocaleString()}`
    );

    console.log('\n📈 BY STATUS:');
    Object.entries(stats.byStatus).forEach(([status, count]) => {
      console.log(
        `   ${status.charAt(0).toUpperCase() + status.slice(1)}: ${count} invoices`
      );
    });

    console.log('\n🏢 BY VENDOR:');
    Object.entries(stats.byVendor).forEach(([vendor, data]) => {
      console.log(
        `   ${vendor}: ${data.count} invoices, $${(data.amount / 100).toLocaleString()}`
      );
    });

    if (Object.keys(stats.byClassCode).length > 0) {
      console.log('\n🏦 BY BIG 12 CLASS CODE:');
      Object.entries(stats.byClassCode).forEach(([code, data]) => {
        console.log(
          `   ${code}: ${data.count} invoices, $${(data.amount / 100).toLocaleString()}`
        );
      });
    }

    if (stats.overdue.length > 0) {
      console.log('\n🚨 OVERDUE INVOICES:');
      stats.overdue.forEach((inv) => {
        console.log(
          `   ${inv.invoice_number} - ${inv.vendor} - $${(inv.amount / 100).toLocaleString()} (${inv.daysOverdue} days overdue)`
        );
      });
    }

    if (stats.upcoming.length > 0) {
      console.log('\n⏰ UPCOMING DUE DATES (Next 30 days):');
      stats.upcoming.sort((a, b) => a.daysUntilDue - b.daysUntilDue);
      stats.upcoming.forEach((inv) => {
        console.log(
          `   ${inv.invoice_number} - ${inv.vendor} - $${(inv.amount / 100).toLocaleString()} (due in ${inv.daysUntilDue} days)`
        );
      });
    }

    return stats;
  }

  async searchInvoices(searchTerm) {
    console.log(`🔍 Searching for: "${searchTerm}"\n`);

    const { data: results, error } = await supabase
      .from('invoices')
      .select('*')
      .or(
        `invoice_number.ilike.%${searchTerm}%,vendor_name.ilike.%${searchTerm}%,notes.ilike.%${searchTerm}%,class_code.ilike.%${searchTerm}%`
      );

    if (error) {
      console.error('❌ Search error:', error);
      return;
    }

    console.log(`📋 Found ${results.length} matching invoices:`);
    results.forEach((inv) => {
      console.log(
        `   ${inv.invoice_number} - ${inv.vendor_name} - $${(inv.total_amount / 100).toLocaleString()} - ${inv.status}`
      );
    });

    return results;
  }

  async updateInvoiceStatus(invoiceNumber, newStatus) {
    console.log(`📝 Updating invoice ${invoiceNumber} to status: ${newStatus}`);

    const { data, error } = await supabase
      .from('invoices')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('invoice_number', invoiceNumber)
      .select();

    if (error) {
      console.error('❌ Update error:', error);
      return false;
    }

    console.log(`✅ Successfully updated invoice ${invoiceNumber}`);
    return true;
  }

  async addClassCodes() {
    console.log('🏷️  Adding Big 12 class codes to invoices...\n');

    // Big 12 class code mapping based on invoice notes/descriptions
    const classCodeMap = {
      basketball: { men: 'S-060-00-BB-M', women: 'S-060-00-BB-W' },
      football: 'S-060-00-FB-0',
      volleyball: 'S-060-00-VB-W',
      soccer: 'S-060-00-SC-W',
      tennis: { men: 'S-060-00-TN-M', women: 'S-060-00-TN-W' },
      golf: { men: 'S-060-00-GF-M', women: 'S-060-00-GF-W' },
      wrestling: 'S-060-00-WW-M',
      gymnastics: 'S-060-00-GY-W',
      swimming: { men: 'S-060-00-SD-M', women: 'S-060-00-SD-W' },
      'cross country': { men: 'S-060-00-CC-M', women: 'S-060-00-CC-W' },
      track: { men: 'S-060-00-OT-M', women: 'S-060-00-OT-W' },
      baseball: 'S-060-00-HB-0',
      softball: 'S-060-00-SB-W',
      lacrosse: 'S-060-00-LX-W',
      equestrian: 'S-060-00-EQ-W',
    };

    const invoices = await this.getAllInvoices();
    if (!invoices) return;

    let updated = 0;

    for (const invoice of invoices) {
      if (invoice.class_code) continue; // Skip if already has class code

      let classCode = 'S-060-00-XX-0'; // Default unallocated
      const notes = (invoice.notes || '').toLowerCase();

      // Try to match sport from notes
      for (const [sport, codes] of Object.entries(classCodeMap)) {
        if (notes.includes(sport)) {
          if (typeof codes === 'string') {
            classCode = codes;
          } else {
            // Check for gender indicators
            if (
              notes.includes('women') ||
              notes.includes('w ') ||
              notes.includes('female')
            ) {
              classCode = codes.women;
            } else if (
              notes.includes('men') ||
              notes.includes('m ') ||
              notes.includes('male')
            ) {
              classCode = codes.men;
            } else {
              classCode = codes.men; // Default to men if unclear
            }
          }
          break;
        }
      }

      // Update the invoice
      const { error } = await supabase
        .from('invoices')
        .update({ class_code: classCode })
        .eq('invoice_number', invoice.invoice_number);

      if (!error) {
        updated++;
        console.log(`   ${invoice.invoice_number}: ${classCode}`);
      }
    }

    console.log(`\n✅ Updated ${updated} invoices with class codes`);
  }
}

// CLI Interface
async function main() {
  const tracker = new AwardsInvoiceTracker();
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
🏆 Big 12 Awards Invoice Tracker Dashboard

Commands:
  node awards-invoice-dashboard.js report           Generate full report
  node awards-invoice-dashboard.js search <term>   Search invoices
  node awards-invoice-dashboard.js update <id> <status>  Update status
  node awards-invoice-dashboard.js codes           Add class codes
    `);
    return;
  }

  const command = args[0];

  switch (command) {
    case 'report':
      await tracker.generateYearlyReport();
      break;

    case 'search':
      if (args[1]) {
        await tracker.searchInvoices(args[1]);
      } else {
        console.log('❌ Please provide search term');
      }
      break;

    case 'update':
      if (args[1] && args[2]) {
        await tracker.updateInvoiceStatus(args[1], args[2]);
      } else {
        console.log('❌ Please provide invoice number and new status');
      }
      break;

    case 'codes':
      await tracker.addClassCodes();
      break;

    default:
      console.log(`❌ Unknown command: ${command}`);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export default AwardsInvoiceTracker;
