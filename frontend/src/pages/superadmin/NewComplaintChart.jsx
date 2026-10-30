import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from 'recharts'

const data = [
  { asal: 'Sibesti', jumlah: 40 },
  { asal: 'Trans Depok', jumlah: 30 },
  { asal: 'Sobat Beken', jumlah: 2 },
  { asal: 'Kabogor', jumlah: 8 },
]

export default function NewComplaintChart() {
  return (
    <div className="w-full min-w-0">
      <div className="h-64 w-full sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 4, right: 24, bottom: 4, left: 8 }}
          >
            <CartesianGrid
              strokeDasharray="2 2"
              horizontal={false}
              stroke="#E2E8F0"
            />

            <XAxis
              type="number"
              domain={[0, 40]}
              tick={{ fontSize: 10, fill: '#64748B' }}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              type="category"
              dataKey="asal"
              width={92}
              tick={{ fontSize: 10, fill: '#334155' }}
              tickLine={false}
              axisLine={false}
            />

            <Tooltip
              formatter={(value) => [value, 'Pengaduan Baru']}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #E2E8F0',
                fontSize: 12,
              }}
            />

            <Bar
              dataKey="jumlah"
              name="Pengaduan Baru"
              fill="#9988F5"
              barSize={36}
            >
              <LabelList
                dataKey="jumlah"
                position="insideRight"
                fill="#FFFFFF"
                fontSize={10}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}