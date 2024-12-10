export function Heading({ level, children }) {
  const Tag = `h${level}`
  const className = level === 1 
    ? "text-4xl font-bold tracking-tight mb-4" 
    : "text-2xl font-semibold mb-4"

  return <Tag className={className}>{children}</Tag>
}

