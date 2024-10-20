import { Bar, BarChart, ResponsiveContainer, Tooltip } from "recharts";
import "./barChartBox.scss";

type Props = {
  title: string;
  dataKey: string;
  chartData: object[];
};

const BarChartBox = ({ title, dataKey, chartData }: Props) => {
  return (
    <div className="barChartBox">
      <h1>{title}</h1>
      <div className="chart">
        <ResponsiveContainer width="99%" height={150}>
          <BarChart data={chartData}>
            <Tooltip
              contentStyle={{ background: "#2a3447", borderRadius: "5px" }}
              labelStyle={{ display: "none" }}
              cursor={{fill:"none"}}
            />
            <Bar dataKey={dataKey} fill="#FF8042" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default BarChartBox;
