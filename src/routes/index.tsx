import { createFileRoute } from '@tanstack/react-router'
import {
  createColumnHelper,
  createSortedRowModel,
  rowSortingFeature,
  tableFeatures,
  useTable,
  type SortingState,
} from '@tanstack/react-table'
import { useState } from 'react'

export const Route = createFileRoute('/')({ component: Home })

type Session = {
  title: string
  speaker: string
  track: string
  time: string
}

const data: Array<Session> = [
  { title: 'The Future of Agentic 123', speaker: 'Ada Lovelace', track: 'Engineering', time: '9:00 AM' },
  { title: 'Scaling LLM Inference', speaker: 'Alan Turing', track: 'Infrastructure', time: '10:30 AM' },
  { title: 'Designing Human-AI Interfaces', speaker: 'Grace Hopper', track: 'Design', time: '1:00 PM' },
  { title: 'Ethics in Autonomous Systems', speaker: 'John McCarthy', track: 'Ethics', time: '2:30 PM' },
  { title: 'Multi-Agent Collaboration', speaker: 'Margaret Hamilton', track: 'Research', time: '4:00 PM' },
]

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
})

const columnHelper = createColumnHelper<typeof features, Session>()

const columns = columnHelper.columns([
  columnHelper.accessor('title', { header: 'Session' }),
  columnHelper.accessor('speaker', { header: 'Speaker' }),
  columnHelper.accessor('track', { header: 'Track' }),
  columnHelper.accessor('time', { header: 'Time' }),
])

function Home() {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useTable({
    features,
    columns,
    data,
    state: { sorting },
    onSortingChange: setSorting,
  })

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">AI Symposium 2026</h1>
      <p className="mt-4 text-lg">Schedule of sessions</p>

      <table className="mt-6 w-full border-collapse text-left">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="cursor-pointer select-none border-b border-gray-300 px-4 py-2 font-semibold"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  {{ asc: ' ▲', desc: ' ▼' }[header.column.getIsSorted() as string] ?? null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="odd:bg-gray-50">
              {row.getAllCells().map((cell) => (
                <td key={cell.id} className="border-b border-gray-200 px-4 py-2">
                  <table.FlexRender cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

