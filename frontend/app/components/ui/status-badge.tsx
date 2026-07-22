interface StatusBadgeProps {
  status: string
}

const styles: Record<string, string> = {
  'In Stock': 'bg-green-500/20 text-green-400 border-green-500/30',
  'Low Stock': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  'Out of Stock': 'bg-red-500/20 text-red-400 border-red-500/30',
  'Expiring': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  'Active': 'bg-green-500/20 text-green-300 border-green-500/30',
  'Inactive': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status] || styles['In Stock']}`}>
      {status}
    </span>
  )
}
