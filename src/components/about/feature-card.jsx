import { Card } from "./ui/card"

export function FeatureCard({ title, description }) {
  return (
    <Card>
      <div className="p-6">
        <h3 className="font-bold mb-2">{title}</h3>
        <p>{description}</p>
      </div>
    </Card>
  )
}

