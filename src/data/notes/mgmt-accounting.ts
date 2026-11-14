import type { TopicNotes } from "@/lib/notes";

const notes: TopicNotes = {
  sections: [
    {
      heading: "Concepts, journal and trial balance",
      points: [
        "Assets = Liabilities + Capital; Capital = opening capital + fresh capital + profit − drawings",
        "Modern rules: an increase in assets or expenses is a debit; an increase in liabilities, capital or income is a credit",
        "Accrual, going concern, consistency, prudence (anticipate losses, not gains), matching, materiality, substance over form",
        "Trial balance agreement does not prove accuracy: errors of omission, commission (same side), principle and compensating errors stay hidden",
        "Rectification after the suspense account is opened: one-sided errors pass through suspense; two-sided errors never touch it",
        "Revenue expenditure goes to the P&L; capital expenditure (including installation and freight on a new asset) is added to the asset's cost",
      ],
    },
    {
      heading: "Depreciation, BRS and final accounts",
      points: [
        "SLM charge = (cost − residual value) ÷ useful life; rate on original cost every year",
        "WDV: book value after n years = cost × (1 − r)ⁿ; the charge falls every year and never reaches zero",
        "Profit or loss on sale = sale proceeds − book value on the date of sale (charge depreciation up to that date first)",
        "BRS from the cash book (Dr) balance: add cheques issued but not presented and bank credits not yet in the cash book; subtract cheques deposited but not cleared and bank charges",
        "An overdraft is the same logic with signs reversed: start with the overdraft as a negative balance",
        "Further bad debts are written off before the provision is computed: new provision = rate × (debtors − further bad debts)",
        "Outstanding expense: add to the expense and show as a liability; prepaid: deduct and show as an asset; closing stock: credit Trading and show as an asset",
      ],
    },
    {
      heading: "Partnership and company accounts",
      points: [
        "Sacrificing ratio = old share − new share; gaining ratio on retirement = new share − old share",
        "Goodwill: average profit method = average profit × years' purchase; super profit = (average profit − normal profit) × years; capitalisation = super profit ÷ normal rate",
        "Hidden goodwill = (capital the new partner's share implies for the whole firm) − (actual combined capital, including the newcomer's)",
        "Revaluation gains and losses are shared in the old ratio; goodwill brought in by a new partner goes to the sacrificing partners in the sacrificing ratio",
        "Forfeiture: debit share capital with the amount called up, credit unpaid calls and the forfeited shares account with the amount received",
        "Reissue: discount on reissue cannot exceed the forfeited amount on those shares; the balance on reissued shares moves to capital reserve",
      ],
    },
    {
      heading: "Cash-flow statement (indirect method)",
      points: [
        "Start with net profit before tax; add back non-cash charges (depreciation, amortisation, loss on sale of assets) and deduct non-operating gains",
        "Increase in current assets (other than cash) reduces operating cash; increase in current liabilities adds to it",
        "Purchase and sale of fixed assets and investments are investing activities; issue and redemption of shares, borrowing and repayment are financing",
        "For a non-financial company, interest and dividends paid are financing outflows; interest and dividends received are investing inflows",
        "Tax paid = opening provision + current charge − closing provision",
      ],
    },
    {
      heading: "Ratio analysis",
      points: [
        "Current ratio = current assets ÷ current liabilities; quick ratio excludes inventory and prepaid expenses",
        "A transaction that reduces current assets and current liabilities equally raises the current ratio only when that ratio is above 1",
        "Debt–equity = long-term debt ÷ shareholders' funds; interest cover = EBIT ÷ interest",
        "Inventory turnover = COGS ÷ average inventory; debtors' collection period = 365 ÷ debtors turnover",
        "Gross margin on sales vs mark-up on cost: margin = markup ÷ (1 + markup)",
        "DuPont: ROE = (net profit ÷ sales) × (sales ÷ total assets) × (total assets ÷ equity)",
      ],
    },
    {
      heading: "Marginal costing and break-even",
      points: [
        "Contribution = sales − variable costs = fixed cost + profit",
        "P/V ratio = contribution ÷ sales = change in profit ÷ change in sales",
        "BEP (₹) = fixed cost ÷ P/V ratio; BEP (units) = fixed cost ÷ contribution per unit",
        "Margin of safety = actual sales − BEP sales = profit ÷ P/V ratio",
        "Sales for a target profit = (fixed cost + target profit) ÷ P/V ratio",
        "Under a key factor, rank products by contribution per unit of the scarce resource, not by contribution per unit",
      ],
    },
    {
      heading: "Standard costing and budgets",
      points: [
        "Material cost variance = SC − AC = price variance + usage variance",
        "Price variance = AQ × (SP − AP); usage variance = SP × (SQ for actual output − AQ)",
        "Usage variance = mix variance + yield variance; labour efficiency variance excludes idle time, which is a separate variance",
        "Labour rate variance = AH paid × (SR − AR); efficiency = SR × (SH − AH worked)",
        "Flexible budget: flex variable costs to actual activity; semi-variable costs split by the high–low method",
        "Cost sheet order: prime cost → factory cost → cost of production → cost of goods sold → cost of sales → profit",
      ],
    },
  ],
};

export default notes;
