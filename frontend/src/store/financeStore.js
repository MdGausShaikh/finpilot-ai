export const expenseCategories = [
  "Food",
  "Shopping",
  "Travel",
  "Bills",
  "Health",
  "Education",
  "Entertainment",
  "Investment",
  "Rent",
  "EMI",
  "Other"
];

export const incomeCategories = [
  "Salary",
  "Freelance",
  "Business",
  "Investment Return",
  "Rental Income",
  "Bonus",
  "Other"
];

export const sampleExpenses = [
  {
    id: 1,
    date: "2026-05-31",
    title: "Swiggy Dinner",
    category: "Food",
    member: "Gaus",
    amount: 520,
    paymentMode: "UPI",
    note: "Dinner order"
  },
  {
    id: 2,
    date: "2026-05-30",
    title: "Amazon Purchase",
    category: "Shopping",
    member: "Gaus",
    amount: 2499,
    paymentMode: "Card",
    note: "Personal shopping"
  },
  {
    id: 3,
    date: "2026-05-29",
    title: "Uber Ride",
    category: "Travel",
    member: "Family",
    amount: 345,
    paymentMode: "UPI",
    note: "Office travel"
  }
];

export const sampleIncome = [
  {
    id: 1,
    date: "2026-05-31",
    title: "Monthly Salary",
    category: "Salary",
    member: "Gaus",
    amount: 120000,
    note: "Primary income"
  },
  {
    id: 2,
    date: "2026-05-25",
    title: "Freelance Project",
    category: "Freelance",
    member: "Gaus",
    amount: 25000,
    note: "Side project"
  }
];

export const familyMembers = [
  {
    id: 1,
    name: "Gaus",
    role: "Admin",
    incomeContribution: 120000,
    expenseShare: 42000
  },
  {
    id: 2,
    name: "Family Member 1",
    role: "Member",
    incomeContribution: 60000,
    expenseShare: 32000
  },
  {
    id: 3,
    name: "Family Member 2",
    role: "Member",
    incomeContribution: 0,
    expenseShare: 21000
  }
];

export function calculateTotal(list) {
  return list.reduce((total, item) => total + Number(item.amount || 0), 0);
}

export function calculateCategoryTotals(expenses) {
  return expenses.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + Number(item.amount || 0);
    return acc;
  }, {});
}