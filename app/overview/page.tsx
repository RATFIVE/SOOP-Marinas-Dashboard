import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 200 },
  { name: 'Apr', value: 278 },
  { name: 'Mai', value: 189 },
  { name: 'Jun', value: 239 },
  { name: 'Jul', value: 349 },
];

export default function OverviewPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Overview</h1>
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#8884d8" fillOpacity={1} fill="url(#colorValue)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
