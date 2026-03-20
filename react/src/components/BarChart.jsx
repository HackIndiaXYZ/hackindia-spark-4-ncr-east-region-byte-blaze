import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function CustomBarChart({ data }) {
  return (
    <div style={{ width: "100%", height: 300 }}>
      <h3>📊 Rainfall Data</h3>

      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="rainfall" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default CustomBarChart;