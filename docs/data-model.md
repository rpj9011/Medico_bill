# PharmaDist ERP — Data Model

## Legacy DBF → New Table Mapping

| Legacy (FoxPro DBF) | New Table | Notes |
|---|---|---|
| ACCOUNT / CRDBTR | parties | Unified; party_type discriminates customer/supplier/both |
| trmay23, trjun23, … (monthly) | sales_invoices + sales_invoice_items | Normalized; voucher_type + invoice_date replace per-month files |
| ALLSALE, CASALE, CCSALE, CNGSALE | sales_invoices | voucher_type ENUM: credit / cash / counter |
| STOCK.DBF | stock_batches | Per-batch, per-godown; quantity_on_hand maintained via stock_movements |
| — | stock_movements | Append-only audit log |
| COMP_MR1..10 columns | company_contacts | Child table instead of 10 repeated columns |
| Per-screen boolean ACL | role_permissions | Module + can_view/create/edit/delete/print |

## Key Design Decisions

1. **No month-per-table**: Legacy FoxPro used separate DBF files per month due to file-size limits. All transactions are in `sales_invoices` with `invoice_date` + `voucher_type`.

2. **Batch-wise stock**: `stock_batches` holds current `quantity_on_hand`. `stock_movements` is the append-only ledger that must always sum to match.

3. **Voucher sequences**: Independent running counters per voucher type in `voucher_sequences`. Never count rows.

4. **DPCO drugs**: `products.is_dpco_controlled` + `dpco_price_ceiling`. Billing UI warns/blocks if discount exceeds ceiling.

5. **Auto ledger posting**: Every invoice, receipt, payment, and credit/debit note auto-creates `ledger_entries`. Direct ledger edits are blocked.

6. **FEFO batch selection**: Default batch selection on billing screen is First Expiry First Out. Manual override allowed.

## GST Logic

- Intra-state (party.state_code === business state code): SGST = rate/2, CGST = rate/2
- Inter-state: IGST = full rate
- GST calculated on: (rate × qty) − trade_discount
- CESS on top of taxable amount
