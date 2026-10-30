import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts'

const data = [
  { alasan: 'Laporan tidak dapat diverifikasi', jumlah: 7 },
  { alasan: 'Kendala sedang ditangani', jumlah: 8 },
  { alasan: 'Tidak ditemukan kendala', jumlah: 3 },
  { alasan: 'Lainnya', jumlah: 2 },
]

const colors = ['#8978F8', '#FF8E88', '#35C2D8', '#FFB347']

export default function RejectionChart() {
  return (
    <div className="h-64 w-full min-w-0 sm:h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="jumlah"
            nameKey="alasan"
            cx="38%"
            cy="50%"
            innerRadius="38%"
            outerRadius="65%"
            paddingAngle={1}
            stroke="none"
          >
            {data.map((item, index) => (
              <Cell key={item.alasan} fill={colors[index]} />
            ))}
          </Pie>

          <Tooltip
            formatter={(value, name) => [`${value} pengaduan`, name]}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid #E2E8F0',
              fontSize: 12,
            }}
          />

          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            iconType="circle"
            iconSize={8}
            wrapperStyle={{
              fontSize: 10,
              maxWidth: '48%',
              lineHeight: '20px',
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}