import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface ChartData {
  name: string;
  value: number;
}

interface ChartProps {
  data: ChartData[];
  color: string;
  title: string;
  chartType: 'line' | 'bar' | 'area' | 'pie';
  onChangeChartType?: (type: 'line' | 'bar' | 'area' | 'pie') => void;
}

const CHART_TYPES = [
  { label: 'Line Chart', value: 'line', icon: '📈' },
  { label: 'Bar Chart', value: 'bar', icon: '📊' },
  { label: 'Area Chart', value: 'area', icon: '🌊' },
  { label: 'Pie Chart', value: 'pie', icon: '🥧' }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export const DynamicChart: React.FC<ChartProps> = ({
  data,
  color,
  title,
  chartType,
  onChangeChartType
}) => {
  const renderChartTypeSelector = () => {
    if (!onChangeChartType) return null;

    return (
      <div className="absolute top-0 right-0 z-10 flex items-center gap-2 p-2 bg-gray-800/90 backdrop-blur-sm rounded-bl-lg border-b border-l border-gray-700">
        <select
          value={chartType}
          onChange={(e) => onChangeChartType(e.target.value as 'line' | 'bar' | 'area' | 'pie')}
          className="px-2 py-1 bg-gray-700/50 border border-gray-600 rounded text-sm text-white cursor-pointer hover:bg-gray-600/50 transition-colors min-w-[120px]"
        >
          {CHART_TYPES.map(type => (
            <option key={type.value} value={type.value} className="bg-gray-800">
              {type.icon} {type.label}
            </option>
          ))}
        </select>
      </div>
    );
  };

  const renderChart = () => {
    const commonProps = {
      data,
      margin: { top: 30, right: 30, left: 20, bottom: 5 }
    };

    const commonAxisProps = {
      stroke: '#9CA3AF',
      tick: { fill: '#9CA3AF' }
    };

    const commonTooltipProps = {
      contentStyle: {
        backgroundColor: '#1F2937',
        border: '1px solid #374151',
        borderRadius: '0.5rem',
      },
      labelStyle: { color: '#9CA3AF' },
      itemStyle: { color: '#9CA3AF' }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip {...commonTooltipProps} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              name={title}
              strokeWidth={2}
              dot={{ fill: color }}
              activeDot={{ r: 8 }}
            />
          </LineChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip {...commonTooltipProps} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar
              dataKey="value"
              fill={color}
              name={title}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" {...commonAxisProps} />
            <YAxis {...commonAxisProps} />
            <Tooltip {...commonTooltipProps} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              fill={color}
              name={title}
              fillOpacity={0.3}
            />
          </AreaChart>
        );

      case 'pie':
        return (
          <PieChart margin={{ top: 30, right: 30, left: 20, bottom: 20 }}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, value }) => `${name}: ${value}`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip {...commonTooltipProps} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
          </PieChart>
        );

      default:
        return null;
    }
  };

  return (
    <div className="relative h-full pt-4">
      {renderChartTypeSelector()}
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}; 