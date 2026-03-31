export default function Card({ title, value, color = 'blue' }) {
  const colors = {
    blue:  'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    red:   'bg-red-50 border-red-200 text-red-700',
    yellow:'bg-yellow-50 border-yellow-200 text-yellow-700',
  }
  return (
    <div className={`border rounded-xl p-5 ${colors[color]}`}>
      <p className="text-sm font-medium opacity-70">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  )
}
