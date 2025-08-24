import { getUserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/data/categories";
import { AddTransactionForm } from "../_components/add-transaction-form";

export default async function AddTransactionPage({ searchParams }) {
  const accounts = await getUserAccounts();


  return (
    <div className="max-w-3xl mx-auto px-5">
      <div className="flex justify-center md:justify-normal mb-8">
        <h1 className="text-5xl gradient-title bg-gradient-to-br from-gray-900 to-gray-500 text-transparent">Add Transaction</h1>
      </div>
      <AddTransactionForm
        accounts={accounts}
        categories={defaultCategories}
      />
    </div>
  );
}