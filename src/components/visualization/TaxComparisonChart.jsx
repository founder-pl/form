import React, { useState } from 'react';
import { Card, Tabs, Tab, Button, ButtonGroup } from 'react-bootstrap';
import { FileEarmarkText, BarChart as BarChartIcon, PieChart as PieChartIcon, Table } from 'react-bootstrap-icons';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useData } from '../../contexts/DataContext';
import TaxBreakdownPie from './TaxBreakdownPie';
import TaxBreakdownTable from './TaxBreakdownTable';

const COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#8DD1E1', '#A4DE6C', '#D0ED57'
];

const TaxComparisonChart = () => {
  const { comparisonResult, availableCountries } = useData();
  const [activeTab, setActiveTab] = useState('bar');

  if (!comparisonResult || comparisonResult.length === 0) {
    return null;
  }

  // Prepare data for the chart
  const chartData = comparisonResult.map((country, index) => {
    const countryInfo = availableCountries.find(c => c.code === country.countryCode) || {};
    return {
      name: countryInfo.name || country.countryCode,
      code: country.countryCode,
      totalTax: country.totalTax,
      effectiveRate: country.effectiveRate * 100, // Convert to percentage
      netIncome: country.netIncome
    };
  });

  // Sort by tax amount (descending)
  chartData.sort((a, b) => b.totalTax - a.totalTax);

  const renderBarChart = () => (
    <div style={{ height: '400px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            angle={-45}
            textAnchor="end"
            height={70}
            tick={{ fontSize: 12 }}
          />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis 
            yAxisId="right" 
            orientation="right" 
            stroke="#82ca9d"
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            formatter={(value, name, props) => {
              if (name === 'Effective Rate') {
                return [`${value}%`, name];
              }
              return [new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0
              }).format(value), name];
            }}
          />
          <Legend />
          <Bar 
            yAxisId="left" 
            dataKey="totalTax" 
            name="Total Tax"
            fill="#8884d8"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
          <Bar 
            yAxisId="right" 
            dataKey="effectiveRate" 
            name="Effective Rate"
            fill="#82ca9d"
            isAnimationActive={false}
          >
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-rate-${index}`} 
                fill={COLORS[(index + 3) % COLORS.length]} 
                fillOpacity={0.7}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );

  const renderPieCharts = () => (
    <div className="row g-4">
      {chartData.map((country, index) => {
        const countryInfo = availableCountries.find(c => c.code === country.code) || {};
        return (
          <div key={country.code} className="col-md-6 col-lg-4">
            <TaxBreakdownPie 
              countryData={{
                ...country,
                name: countryInfo.name || country.code,
                taxBreakdown: country.taxBreakdown || {
                  income_tax: 0.3,
                  social_security: 0.2,
                  health_insurance: 0.1,
                  other: 0.1
                }
              }} 
            />
          </div>
        );
      })}
    </div>
  );

  const renderTabTitle = (title, icon) => (
    <span className="d-flex align-items-center">
      {icon}
      <span className="ms-1 d-none d-sm-inline">{title}</span>
    </span>
  );

  return (
    <Card className="mb-4">
      <Card.Body>
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
          variant="pills"
        >
          <Tab 
            eventKey="bar" 
            title={renderTabTitle('Comparison', <BarChartIcon />)}
            className="p-3"
          >
            <div className="mt-3">
              <h6 className="text-muted mb-3">Comparison of Tax Amounts and Effective Rates</h6>
              {renderBarChart()}
            </div>
          </Tab>
          <Tab 
            eventKey="pie" 
            title={renderTabTitle('Breakdown', <PieChartIcon />)}
            className="p-3"
          >
            <div className="mt-3">
              <h6 className="text-muted mb-3">Detailed Tax Breakdown by Country</h6>
              {renderPieCharts()}
            </div>
          </Tab>
          <Tab 
            eventKey="table" 
            title={renderTabTitle('Table', <FileEarmarkText />)}
            className="p-3"
          >
            <div className="mt-3">
              <TaxBreakdownTable />
            </div>
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default TaxComparisonChart;
