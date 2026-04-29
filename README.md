# Travel Expense Tracker

A mobile-friendly web app for tracking travel expenses, categorizing spending, and managing budgets.

## Features

- **Categorize Spending**: Organize expenses into categories like Food, Transport, etc.
- **Daily Tracking**: View spending per category at the end of each day.
- **Budget Management**: Add money to categories and track remaining balances.
- **Statistics**: Review daily spending records with itemized purchases.
- **Checklist**: Plan purchases with budgeted amounts and mark as completed.
- **Real-time Currency Conversion**: Convert between Japanese Yen (JPY) and Malaysian Ringgit (MYR) using live exchange rates from online APIs.
- **Mobile-Friendly**: Responsive design for use on mobile devices.

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

- **Home**: Overview of total budget, spending, and category summaries. Includes a currency converter.
- **Categories**: View balances, add new categories, and add money to existing categories.
- **Statistics**: Daily breakdown of expenses by category.
- **Checklist**: Manage planned purchases with budgets.
- **Add Expense**: Use the + button to record new expenses.

Data is stored locally in the browser.

## Deploy on Vercel

1. Push your code to a GitHub repository.
2. Connect your repository to Vercel.
3. Deploy automatically.

For more details, see [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).
