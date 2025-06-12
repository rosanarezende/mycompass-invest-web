import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">MyCompass Invest</h1>
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <Card className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">
            Portfolio Management
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Intelligent portfolio balancing and optimization
          </p>
        </Card>

        <Card className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">
            Tax Optimization
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Brazilian tax rules automation and optimization
          </p>
        </Card>

        <Card className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">
            Smart Analytics
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Advanced analytics with privacy-first ML
          </p>
        </Card>

        <Card className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100">
          <h2 className="mb-3 text-2xl font-semibold">
            Open Finance
          </h2>
          <p className="m-0 max-w-[30ch] text-sm opacity-50">
            Native integration with Brazilian Open Finance
          </p>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button>Get Started</Button>
        <Button variant="outline">Learn More</Button>
      </div>
    </main>
  )
}
