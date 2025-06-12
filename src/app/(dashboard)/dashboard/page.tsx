export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      {/* Dashboard content will be implemented here */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Portfolio Value</h2>
          <p className="text-3xl font-bold text-green-600">R$ 125.430,50</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Monthly Return</h2>
          <p className="text-3xl font-bold text-blue-600">+5.2%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">Tax Saved</h2>
          <p className="text-3xl font-bold text-purple-600">R$ 2.450,00</p>
        </div>
      </div>
    </div>
  )
}
