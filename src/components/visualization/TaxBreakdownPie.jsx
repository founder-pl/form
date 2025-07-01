import React from 'react';
import { Card } from 'react-bootstrap';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend
} from 'recharts';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#8DD1E1', '#A4DE6C', '#D0ED57'
];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN) * 1.1;
  const y = cy + radius * Math.sin(-midAngle * RADIAN) * 1.1;

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      style={{ fontSize: '12px', fontWeight: 'bold' }}
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const TaxBreakdownPie = ({ countryData }) => {
  if (!countryData || !countryData.taxBreakdown) {
    return (
      <Card className="h-100">
        <Card.Body className="d-flex align-items-center justify-content-center">
          <div className="text-center text-muted">
            <i className="bi bi-pie-chart" style={{ fontSize: '2rem' }}></i>
            <p className="mt-2 mb-0">No tax breakdown data available</p>
          </div>
        </Card.Body>
      </Card>
    );
  }

  const { taxBreakdown, name } = countryData;
  const data = Object.entries(taxBreakdown).map(([name, value]) => ({
    name: name.replace(/_/g, ' '),
    value: value * 100 // Convert to percentage
  }));

  return (
    <Card className="h-100">
      <Card.Body>
        <h6 className="text-center mb-3">{name} - Tax Breakdown</h6>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}%`, 'Percentage']}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-3 small text-muted text-center">
          Hover over segments for details
        </div>
      </Card.Body>
    </Card>
  );
};

export default TaxBreakdownPie;
