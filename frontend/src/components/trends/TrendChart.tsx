'use client';

import { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/design-system';
import { TrendingUp, TrendingDown, Activity, BarChart3 } from 'lucide-react';

export interface TrendChartProps {
  trendId: string;
  timeWindow?: '1h' | '6h' | '24h' | '7d' | '30d';
  height?: number;
  width?: number;
  color?: string;
  showAxes?: boolean;
  showGrid?: boolean;
  showTooltip?: boolean;
  showTrendLine?: boolean;
  animate?: boolean;
  className?: string;
}

interface DataPoint {
  timestamp: number;
  value: number;
  label: string;
}

interface TrendData {
  points: DataPoint[];
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  peak: number;
  average: number;
}

export function TrendChart({
  trendId,
  timeWindow = '24h',
  height = 120,
  width,
  color = '#1da1f2',
  showAxes = true,
  showGrid = false,
  showTooltip = true,
  showTrendLine = true,
  animate = true,
  className,
}: TrendChartProps) {
  const [data, setData] = useState<TrendData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch trend data
  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/trends/${trendId}/chart?timeWindow=${timeWindow}`, {
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch trend data: ${response.statusText}`);
        }

        const trendData = await response.json();
        setData(trendData);
      } catch (err) {
        console.error('Error fetching trend data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load trend data');

        // Generate mock data for development
        const mockData = generateMockData(timeWindow);
        setData(mockData);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendData();
  }, [trendId, timeWindow]);

  // Generate mock data for development
  const generateMockData = (window: string): TrendData => {
    const pointCount = window === '1h' ? 12 : window === '6h' ? 24 : window === '24h' ? 48 : 168;
    const baseValue = Math.random() * 1000 + 100;
    const points: DataPoint[] = [];

    for (let i = 0; i < pointCount; i++) {
      const timestamp = Date.now() - (pointCount - i) * (window === '1h' ? 5 * 60 * 1000 :
                                                        window === '6h' ? 15 * 60 * 1000 :
                                                        window === '24h' ? 30 * 60 * 1000 :
                                                        60 * 60 * 1000);
      const variation = (Math.random() - 0.5) * 200;
      const trend = Math.sin(i / pointCount * Math.PI * 2) * 150;
      const value = Math.max(0, baseValue + variation + trend);

      points.push({
        timestamp,
        value,
        label: new Date(timestamp).toLocaleTimeString(),
      });
    }

    const firstValue = points[0].value;
    const lastValue = points[points.length - 1].value;
    const changePercent = ((lastValue - firstValue) / firstValue) * 100;
    const peak = Math.max(...points.map(p => p.value));
    const average = points.reduce((sum, p) => sum + p.value, 0) / points.length;

    return {
      points,
      trend: changePercent > 5 ? 'up' : changePercent < -5 ? 'down' : 'stable',
      changePercent,
      peak,
      average,
    };
  };

  // Draw chart on canvas
  useEffect(() => {
    if (!data || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const padding = { top: 10, right: 10, bottom: showAxes ? 30 : 10, left: showAxes ? 40 : 10 };
    const chartWidth = rect.width - padding.left - padding.right;
    const chartHeight = rect.height - padding.top - padding.bottom;

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw grid
    if (showGrid) {
      ctx.strokeStyle = '#f3f4f6';
      ctx.lineWidth = 1;

      // Horizontal grid lines
      for (let i = 0; i <= 5; i++) {
        const y = padding.top + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding.left, y);
        ctx.lineTo(padding.left + chartWidth, y);
        ctx.stroke();
      }

      // Vertical grid lines
      for (let i = 0; i <= 6; i++) {
        const x = padding.left + (chartWidth / 6) * i;
        ctx.beginPath();
        ctx.moveTo(x, padding.top);
        ctx.lineTo(x, padding.top + chartHeight);
        ctx.stroke();
      }
    }

    // Calculate scales
    const minValue = Math.min(...data.points.map(p => p.value));
    const maxValue = Math.max(...data.points.map(p => p.value));
    const valueRange = maxValue - minValue || 1;

    // Draw trend line
    if (showTrendLine && data.points.length > 1) {
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();

      data.points.forEach((point, index) => {
        const x = padding.left + (index / (data.points.length - 1)) * chartWidth;
        const y = padding.top + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;

        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();

      // Fill area under curve
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = color;
      ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
      ctx.lineTo(padding.left, padding.top + chartHeight);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // Draw data points
    data.points.forEach((point, index) => {
      const x = padding.left + (index / (data.points.length - 1)) * chartWidth;
      const y = padding.top + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw axes
    if (showAxes) {
      ctx.strokeStyle = '#6b7280';
      ctx.lineWidth = 1;
      ctx.font = '12px system-ui';
      ctx.fillStyle = '#6b7280';

      // Y-axis
      ctx.beginPath();
      ctx.moveTo(padding.left, padding.top);
      ctx.lineTo(padding.left, padding.top + chartHeight);
      ctx.stroke();

      // Y-axis labels
      for (let i = 0; i <= 3; i++) {
        const value = minValue + (valueRange / 3) * i;
        const y = padding.top + chartHeight - (i / 3) * chartHeight;
        ctx.fillText(Math.round(value).toString(), 5, y + 4);
      }

      // X-axis
      ctx.beginPath();
      ctx.moveTo(padding.left, padding.top + chartHeight);
      ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight);
      ctx.stroke();
    }
  }, [data, color, showAxes, showGrid, showTrendLine]);

  // Handle mouse interaction
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!data || !canvasRef.current || !showTooltip) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setMousePosition({ x: event.clientX, y: event.clientY });

    const padding = { left: showAxes ? 40 : 10, right: 10 };
    const chartWidth = rect.width - padding.left - padding.right;

    const pointIndex = Math.round(((x - padding.left) / chartWidth) * (data.points.length - 1));

    if (pointIndex >= 0 && pointIndex < data.points.length) {
      setHoveredPoint(data.points[pointIndex]);
    } else {
      setHoveredPoint(null);
    }
  };

  const handleMouseLeave = () => {
    setHoveredPoint(null);
  };

  if (isLoading) {
    return (
      <div className={cn('flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg', className)} style={{ height }}>
        <div className="flex items-center space-x-2 text-x-text-secondary dark:text-x-text-secondary-dark">
          <Activity className="w-5 h-5 animate-pulse" />
          <span className="text-sm">Loading chart...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn('flex items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-lg', className)} style={{ height }}>
        <div className="text-center text-x-text-secondary dark:text-x-text-secondary-dark">
          <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Chart unavailable</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const containerWidth = width || '100%';

  return (
    <div
      ref={containerRef}
      className={cn('relative bg-white dark:bg-gray-900 rounded-lg border border-x-border', className)}
      style={{ height, width: containerWidth }}
    >
      {/* Chart header */}
      <div className="absolute top-2 left-3 right-3 flex items-center justify-between z-10">
        <div className="flex items-center space-x-2">
          {data.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-500" />}
          {data.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-500" />}
          {data.trend === 'stable' && <Activity className="w-4 h-4 text-gray-500" />}

          <span className={cn(
            'text-xs font-medium',
            data.trend === 'up' && 'text-green-600',
            data.trend === 'down' && 'text-red-600',
            data.trend === 'stable' && 'text-gray-600'
          )}>
            {data.changePercent > 0 ? '+' : ''}{data.changePercent.toFixed(1)}%
          </span>
        </div>

        <div className="text-xs text-x-text-secondary dark:text-x-text-secondary-dark">
          {timeWindow}
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ height, width: '100%' }}
      />

      {/* Tooltip */}
      {showTooltip && hoveredPoint && (
        <div
          className="fixed z-50 bg-black text-white text-xs rounded px-2 py-1 pointer-events-none"
          style={{
            left: mousePosition.x + 10,
            top: mousePosition.y - 30,
          }}
        >
          <div>Value: {Math.round(hoveredPoint.value)}</div>
          <div>Time: {hoveredPoint.label}</div>
        </div>
      )}
    </div>
  );
}